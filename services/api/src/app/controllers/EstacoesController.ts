import { WhereOptions, Order, Op } from "sequelize";
import * as Yup from "yup";
import { Request, Response } from "express";
import database from "../../database/index.js";
import crypto from "crypto";

import Estacao from "../models/Estacao.js";
import Leitura from "../models/Leitura.js";
import Usuario from "../models/Usuario.js";

import adicionarFiltroLike from "../utils/adicionarFiltroLike.js";
import construirIntervaloData from "../utils/construirIntervaloData.js";
import construirOrdenacao from "../utils/construirOrdenacao.js";
import adicionarFiltroGeografico from "../utils/adicionarFiltroGeografico.js";
import adicionarFiltroStatus from "../utils/adicionarFiltroStatus.js";
import { processarLocalizacao } from "../../lib/geolocalizacao.js";
import calcularDistancia from "../utils/calcularDistancia.js";

interface Params {
  id: string;
}

interface Query {
  nome?: string;
  status?: string;
  endereco?: string;
  criadoAntes?: string;
  criadoDepois?: string;
  atualizadoAntes?: string;
  atualizadoDepois?: string;
  sort?: string;
  page?: string;
  limit?: string;
}

const STATUS = ["ATIVA", "INATIVA", "MANUTENCAO"] as const;

class EstacoesController {
  async index(req: Request<object, object, object, Query>, res: Response) {
    const {
      nome,
      status,
      endereco,
      criadoAntes,
      criadoDepois,
      atualizadoAntes,
      atualizadoDepois,
      sort,
    } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 25, 100);

    const where: WhereOptions<Estacao> = {};
    const order: Order = construirOrdenacao(sort);

    adicionarFiltroLike(where, "nome", nome);
    adicionarFiltroLike(where, "endereco", endereco);

    const criado = construirIntervaloData(criadoAntes, criadoDepois);
    if (criado) {
      Object.assign(where, { criado_em: criado });
    }

    const atualizado = construirIntervaloData(
      atualizadoAntes,
      atualizadoDepois
    );
    if (atualizado) {
      Object.assign(where, { atualizado_em: atualizado });
    }

    try {
      adicionarFiltroStatus(where, status, STATUS);
    } catch {
      return res.status(400).json({ erro: "Status inválido" });
    }

    adicionarFiltroGeografico(where, req.query);

    const estacoes = await Estacao.findAll({
      where,
      include: [
        { model: Leitura, as: "leituras", attributes: ["id", "estacao_id"] },
        {
          model: Usuario,
          as: "proprietario",
          attributes: ["id", "nome", "email"],
        },
        {
          model: Usuario,
          as: "equipe",
          attributes: ["id", "nome", "email"],
          through: { attributes: ["papel"] },
        },
      ],
      order,
      limit,
      offset: (page - 1) * limit,
    });

    return res.json(estacoes);
  }

  async show(req: Request<Params>, res: Response) {
    const estacao = await Estacao.findByPk(req.params.id, {
      include: [
        {
          model: Usuario,
          as: "proprietario",
          attributes: ["id", "nome", "email"],
        },
        {
          model: Usuario,
          as: "equipe",
          attributes: ["id", "nome", "email"],
          through: { attributes: ["papel"] },
        },
        { model: Leitura, as: "leituras" },
      ],
    });

    if (!estacao) return res.status(404).json();

    return res.json(estacao);
  }

  async create(req: Request, res: Response) {
    let transaction;

    try {
      const schema = Yup.object()
        .shape({
          nome: Yup.string().trim().required(),

          endereco: Yup.string().nullable(),

          localizacao: Yup.object({
            latitude: Yup.number().min(-90).max(90),
            longitude: Yup.number().min(-180).max(180),
          })
            .nullable()
            .notRequired(),

          status: Yup.string()
            .transform((v) => v?.toUpperCase())
            .oneOf(STATUS)
            .default("INATIVA"),
        })
        .test(
          "endereco-ou-coordenadas",
          "Informe endereco ou localizacao válida.",
          (value) => {
            if (!value) return false;

            const temEndereco = !!value.endereco;

            const temCoords =
              value.localizacao &&
              value.localizacao.latitude != null &&
              value.localizacao.longitude != null;

            return temEndereco || temCoords;
          }
        );

      const validated = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      const { nome, localizacao, endereco, status } = validated;

      transaction = await database.connection.transaction();

      const apiKey = crypto.randomUUID();

      const hasCoords =
        localizacao &&
        typeof localizacao.latitude === "number" &&
        typeof localizacao.longitude === "number";

      const data = await processarLocalizacao({
        endereco,
        coordinates: hasCoords
          ? [localizacao.longitude, localizacao.latitude]
          : undefined,
      });

      if (!req.userId) {
        await transaction.rollback();
        return res.status(401).json({ erro: "Não autenticado." });
      }
      console.log("COORDINATES:", data.coordinates);

      const novaEstacao = await Estacao.create(
        {
          nome,
          api_key: apiKey,
          usuario_proprietario_id: Number(req.userId),
          endereco: data.endereco,
          localizacao: database.connection.literal(
            `ST_SetSRID(ST_MakePoint(${data.coordinates[0]}, ${data.coordinates[1]}), 4326)::geography`
          ),
          status: status || "INATIVA",
        },
        { transaction }
      );

      const usuario = await Usuario.findByPk(req.userId, { transaction });

      if (!usuario) {
        await transaction.rollback();
        return res.status(404).json({ erro: "Usuario não encontrado." });
      }

      await novaEstacao.addEquipe(usuario, {
        through: { papel: "PROPRIETARIO" },
        transaction,
      });

      await transaction.commit();

      return res.status(201).json(novaEstacao);
    } catch (err: any) {
      if (transaction) await transaction.rollback();

      return res.status(400).json({
        erro: err.message || "Erro ao criar estação.",
      });
    }
  }

  async update(req: Request<Params>, res: Response) {
    const estacao = await Estacao.findByPk(req.params.id);

    if (!estacao) return res.status(404).json();

    const schema = Yup.object().shape({
      nome: Yup.string(),

      endereco: Yup.string(),

      status: Yup.string()
        .transform((v) => v?.toUpperCase())
        .oneOf(STATUS),

      localizacao: Yup.object({
        longitude: Yup.number().min(-180).max(180),
        latitude: Yup.number().min(-90).max(90),
      }),
    });

    const validated = await schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const updateData: Partial<{
      nome: string;
      endereco: string;
      status: string;
      localizacao: {
        type: "Point";
        coordinates: [number, number];
      };
    }> = {};

    if (validated.nome) updateData.nome = validated.nome;

    if (validated.status) updateData.status = validated.status.toUpperCase();

    if (validated.endereco || validated.localizacao) {
      const data = await processarLocalizacao({
        endereco: validated.endereco,
        coordinates: validated.localizacao
          ? [validated.localizacao.longitude, validated.localizacao.latitude]
          : undefined,
      });

      updateData.endereco = data.endereco;
      updateData.localizacao = {
        type: "Point",
        coordinates: data.coordinates,
      };
    }

    await estacao.update(updateData);

    return res.json(estacao);
  }

  async destroy(req: Request<Params>, res: Response) {
    const estacao = await Estacao.findByPk(req.params.id);

    if (!estacao) return res.status(404).json();

    await estacao.destroy();

    return res.json();
  }

  async distEstacao(req: Request, res: Response) {
    try {
      const schema = Yup.object().shape({
        localizacao: Yup.object({
          latitude: Yup.number().required().min(-90).max(90),
          longitude: Yup.number().required().min(-180).max(180),
        }).required(),
      });

      const validado = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      const { localizacao } = validado;

      const estacao = await calcularDistancia(localizacao);

      if (!estacao) {
        return res.status(404).json({ error: "Nenhuma estação encontrada" });
      }

      return res.json(estacao);
    } catch (err) {
      console.error("Erro: ", err);
      return res.status(400).json({ error: "Erro ao calcular distância" });
    }
  }
}

export default new EstacoesController();

import { WhereOptions, Order } from "sequelize";
import { parseISO } from "date-fns";
import * as Yup from "yup";
import { Request, Response } from "express";
import crypto from "crypto";

import Estacao from "../models/Estacao.js";
import Leitura from "../models/Leitura.js";
import Usuario from "../models/Usuario.js";

import adicionarFiltroLike from "../utils/adicionarFiltroLike.js";
import construirIntervaloData from "../utils/construirIntervaloData.js";
import construirOrdenacao from "../utils/construirOrdenacao.js";

interface Params {
  id: string;
}

interface Query {
  nome?: string;
  criadoAntes?: string;
  criadoDepois?: string;
  atualizadoAntes?: string;
  atualizadoDepois?: string;
  sort?: string;
  page?: string;
  limit?: string;
}

class EstacoesController {
  async index(req: Request<object, object, object, Query>, res: Response) {
    const {
      nome,
      criadoAntes,
      criadoDepois,
      atualizadoAntes,
      atualizadoDepois,
      sort,
    } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 25, 100);

    const where: WhereOptions = {};
    const order: Order = construirOrdenacao(sort);

    adicionarFiltroLike(where, "nome", nome);

    const criado = construirIntervaloData(criadoAntes, criadoDepois);
    if (criado) (where as any).criado_em = criado;

    const atualizado = construirIntervaloData(
      atualizadoAntes,
      atualizadoDepois
    );

    if (atualizado) (where as any).atualizado_em = atualizado;

    order = construirOrdenacao(sort);

    const estacoes = await Estacao.findAll({
      where,
      include: [
        {
          model: Leitura,
          as: "leituras",
          attributes: ["id", "estacao_id"],
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
          model: Leitura,
          as: "leituras",
          attributes: ["id", "estacao_id"],
        },
      ],
    });

    if (!estacao) {
      return res.status(404).json();
    }

    return res.json(estacao);
  }

  async create(req: Request, res: Response) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      localizacao: Yup.object({
        longitude: Yup.number().required().min(-180).max(180),
        latitude: Yup.number().required().min(-90).max(90),
      }).required(),
    });

    const { body } = req;

    if (!(await schema.isValid(body))) {
      return res.status(400).json({ erro: "Erro ao validar schema." });
    }

    const {
      nome,
      localizacao: { longitude, latitude },
    } = body;

    const apiKey = crypto.randomBytes(32).toString("hex");

    const novaEstacao = await Estacao.create({
      nome,
      api_key: apiKey,
      usuario_proprietario_id: req.userId,
      localizacao: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });

    const usuario = await Usuario.findByPk(req.userId);

    if (!usuario) {
      return res.status(404).json({ erro: "Usuario não encontrado." });
    }

    await usuario.addEstacoes([novaEstacao]);

    return res.status(201).json(novaEstacao);
  }

  async update(req: Request<Params>, res: Response) {
    const estacao = await Estacao.findByPk(req.params.id);

    if (!estacao) {
      return res.status(404).json();
    }

    const schema = Yup.object().shape({
      nome: Yup.string(),
      localizacao: Yup.object({
        longitude: Yup.number().min(-180).max(180),
        latitude: Yup.number().min(-90).max(90),
      }),
    });

    const { body } = req;

    if (!(await schema.isValid(body))) {
      return res.status(400).json({ erro: "Erro ao validar schema." });
    }

    const updateData: Partial<{
      nome: string;
      localizacao: {
        type: "Point";
        coordinates: [number, number];
      };
    }> = {};

    if (body.nome) {
      updateData.nome = body.nome;
    }

    if (body.localizacao) {
      if (
        body.localizacao.latitude == null ||
        body.localizacao.longitude == null
      ) {
        return res.status(400).json({
          error: "A latitude e a longitude devem ser fornecidas juntas.",
        });
      }

      const { latitude, longitude } = body.localizacao;

      updateData.localizacao = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
    }

    await estacao.update(updateData);

    return res.json(estacao);
  }
  async destroy(req: Request<Params>, res: Response) {
    const estacao = await Estacao.findByPk(req.params.id);

    if (!estacao) {
      return res.status(404).json();
    }

    await estacao.destroy();

    return res.json();
  }
}

export default new EstacoesController();

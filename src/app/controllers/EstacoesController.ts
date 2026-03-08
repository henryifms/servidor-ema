import { Op, WhereOptions, Order } from "sequelize";
import { parseISO } from "date-fns";
import * as Yup from "yup";
import { Request, Response } from "express";
import crypto from "crypto";

import Estacao from "../models/Estacao.js";
import Leitura from "../models/Leitura.js";

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

class EstacoesControllers {
  async index(req: Request<{}, {}, {}, Query>, res: Response) {
    const {
      nome,
      criadoAntes,
      criadoDepois,
      atualizadoAntes,
      atualizadoDepois,
      sort,
    } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 25;

    let where: WhereOptions = {};
    let order: Order = [];

    if (nome) {
      where = {
        ...where,
        nome: {
          [Op.iLike]: `%${nome}%`,
        },
      };
    }

    if (criadoAntes || criadoDepois) {
      const criadoEm: Record<symbol, Date> = {};

      if (criadoAntes) {
        criadoEm[Op.lte] = parseISO(criadoAntes);
      }
      if (criadoDepois) {
        criadoEm[Op.gte] = parseISO(criadoDepois);
      }

      where = { ...where, criado_em: criadoEm };
    }

    if (atualizadoAntes || atualizadoDepois) {
      const atualizadoEm: Record<symbol, Date> = {};

      if (atualizadoAntes) {
        atualizadoEm[Op.lte] = parseISO(atualizadoAntes);
      }

      if (atualizadoDepois) {
        atualizadoEm[Op.gte] = parseISO(atualizadoDepois);
      }

      where = { ...where, atualizado_em: atualizadoEm };
    }

    if (sort) {
      order = sort
        .split(",")
        .map((item) => item.split(":") as [string, "ASC" | "DESC"]);
    }

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
      offset: limit * page - limit,
    });

    return res.json(estacoes);
  }

  async show(req: Request<Params>, res: Response) {
    const estacao = await Estacao.findByPk(req.params.id);

    if (!estacao) {
      return res.status(404).json();
    }

    return res.json(estacao);
  }

  async create(req: Request<Params>, res: Response) {
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
      localizacao: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });

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
    const estacao = await Estacao.findByPk(req.params.id)

    if (!estacao) {
      return res.status(404).json();
    }

    estacao.destroy();

    return res.json();
  }
}

export default new EstacoesControllers();

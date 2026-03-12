import { Request, Response } from "express";
import { WhereOptions, Order } from "sequelize";
import * as Yup from "yup";

import construirRange from "../utils/construirRange.js";
import construirOrdenacao from "../utils/construirOrdenacao.js";
import construirIntervaloData from "../utils/construirIntervaloData.js";
import adicionarFiltroExato from "../utils/adicionarFiltroExato.js";

import Leitura from "../models/Leitura.js";
import Estacao from "../models/Estacao.js";

import redis from "../../lib/redis.js";
import Queue from "../../lib/Queue.js";
import SaveLeituraJob from "../jobs/SaveLeituraJob.js";

interface Params {
  id: string;
  estacaoId: string;
}

interface Query {
  temperatura?: string;
  temperatura_min?: string;
  temperatura_max?: string;

  umidade?: string;
  umidade_min?: string;
  umidade_max?: string;

  pressao_atmosferica?: string;
  pressao_atmosferica_min?: string;
  pressao_atmosferica_max?: string;

  velocidade_vento?: string;
  velocidade_vento_min?: string;
  velocidade_vento_max?: string;

  precipitacao?: string;
  precipitacao_min?: string;
  precipitacao_max?: string;

  criadaAntes?: string;
  criadaDepois?: string;

  sort?: string;
  page?: string;
  limit?: string;
}

class LeiturasController {
  async index(req: Request<Params, unknown, unknown, Query>, res: Response) {
    const {
      temperatura,
      temperatura_min,
      temperatura_max,

      umidade,
      umidade_min,
      umidade_max,

      pressao_atmosferica,
      pressao_atmosferica_min,
      pressao_atmosferica_max,

      velocidade_vento,
      velocidade_vento_min,
      velocidade_vento_max,

      precipitacao,
      precipitacao_min,
      precipitacao_max,

      criadaAntes,
      criadaDepois,

      sort,
    } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 25, 100);

    const { estacaoId } = req.params;

    const where: WhereOptions = {
      estacao_id: estacaoId,
    };

    let order: Order = [];

    // filtros exatos
    adicionarFiltroExato(where, "temperatura", temperatura);
    adicionarFiltroExato(where, "umidade", umidade);
    adicionarFiltroExato(where, "pressao_atmosferica", pressao_atmosferica);
    adicionarFiltroExato(where, "velocidade_vento", velocidade_vento);
    adicionarFiltroExato(where, "precipitacao", precipitacao);

    // ranges
    const temperaturaRange = construirRange(temperatura_min, temperatura_max);
    if (temperaturaRange) (where as any).temperatura = temperaturaRange;

    const umidadeRange = construirRange(umidade_min, umidade_max);
    if (umidadeRange) (where as any).umidade = umidadeRange;

    const pressaoRange = construirRange(
      pressao_atmosferica_min,
      pressao_atmosferica_max
    );
    if (pressaoRange) (where as any).pressao_atmosferica = pressaoRange;

    const ventoRange = construirRange(
      velocidade_vento_min,
      velocidade_vento_max
    );
    if (ventoRange) (where as any).velocidade_vento = ventoRange;

    const precipitacaoRange = construirRange(
      precipitacao_min,
      precipitacao_max
    );
    if (precipitacaoRange) (where as any).precipitacao = precipitacaoRange;

    // filtro por data
    const data = construirIntervaloData(criadaAntes, criadaDepois);
    if (data) (where as any).data_leitura = data;

    order = construirOrdenacao(sort);

    const leituras = await Leitura.findAll({
      where,
      include: [
        {
          model: Estacao,
          as: "estacao",
          attributes: ["id", "nome"],
        },
      ],
      order,
      limit,
      offset: (page - 1) * limit,
    });

    return res.json(leituras);
  }

  async show(req: Request<Params>, res: Response) {
    const leitura = await Leitura.findByPk(req.params.id, {
      include: [
        {
          model: Estacao,
          as: "estacao",
          attributes: ["id", "nome"],
        },
      ],
    });

    if (!leitura) {
      return res.status(404).json();
    }

    return res.json(leitura);
  }

  async create(req: Request, res: Response) {
    try {
      const schema = Yup.object().shape({
        temperatura: Yup.number().required(),
        umidade: Yup.number().required(),
        pressao_atmosferica: Yup.number().required(),
        velocidade_vento: Yup.number().required(),
        precipitacao: Yup.number().required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ erro: "Erro ao validar schema." });
      }

      if (!req.estacaoId) {
        return res.status(401).json({ erro: "Estação não autenticada." });
      }

      const leitura = {
        estacao_id: req.estacaoId,
        ...req.body,
        data_leitura: new Date(),
      };

      await redis.set(
        `estacao:${req.estacaoId}:ultima`,
        JSON.stringify(leitura)
      );

      await Queue.add(SaveLeituraJob.key, leitura);

      return res.status(202).json(leitura);
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        erro: "Erro interno no servidor.",
      });
    }
  }

  async ultima(req: Request<Params>, res: Response) {
    const { estacaoId } = req.params;

    const ultimaLeitura = await redis.get(`estacao:${estacaoId}:ultima`);

    if (!ultimaLeitura) {
      return res.status(404).json();
    }

    return res.json(JSON.parse(ultimaLeitura));
  }
}

export default new LeiturasController();

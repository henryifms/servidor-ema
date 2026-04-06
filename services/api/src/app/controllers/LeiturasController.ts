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
  async index(req: Request<Params, any, any, Query>, res: Response) {
    const { estacaoId } = req.params;

    console.log("QUERY COMPLETA:", req.query);

    // 1. Validar se a estação existe no Banco de Dados
    const estacaoExiste = await Estacao.findByPk(estacaoId);

    if (!estacaoExiste) {
      return res
        .status(404)
        .json({ erro: "Estação meteorológica não encontrada." });
    }

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

    console.log("VALORES EXTRAÍDOS:", { umidade_min, umidade_max });

    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 25, 100);

    const where: WhereOptions = {
      estacao_id: estacaoId,
    };

    // filtros exatos
    adicionarFiltroExato(where, "temperatura", temperatura);
    adicionarFiltroExato(where, "umidade", umidade);
    adicionarFiltroExato(where, "pressao_atmosferica", pressao_atmosferica);
    adicionarFiltroExato(where, "velocidade_vento", velocidade_vento);
    adicionarFiltroExato(where, "precipitacao", precipitacao);

    // ranges (usando casting para evitar erro de tipo do TS)
    const filtros = [
      {
        campo: "temperatura",
        range: construirRange(temperatura_min, temperatura_max),
      },
      { campo: "umidade", range: construirRange(umidade_min, umidade_max) },
      {
        campo: "pressao_atmosferica",
        range: construirRange(pressao_atmosferica_min, pressao_atmosferica_max),
      },
      {
        campo: "velocidade_vento",
        range: construirRange(velocidade_vento_min, velocidade_vento_max),
      },
      {
        campo: "precipitacao",
        range: construirRange(precipitacao_min, precipitacao_max),
      },
      {
        campo: "data_leitura",
        range: construirIntervaloData(criadaAntes, criadaDepois),
      },
    ];

    filtros.forEach((f) => {
      if (f.range) {
        Object.assign(where, {
          [f.campo]: f.range,
        });
      }
    });

    const order = construirOrdenacao(sort);

    console.log("OBJETO WHERE FINAL:", JSON.stringify(where, null, 2));
    console.log("FILTROS PROCESSADOS:", filtros);

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

      // A chave deve ser a mesma onde você acabou de salvar
      const chave = `estacao:${req.estacaoId}:ultima`;

      const existe = await redis.exists(chave);

      if (existe) {
        console.log(
          `Há uma leitura recente para a estação ${req.estacaoId} no cache.`
        );
      } else {
        console.log("Não há leituras para esta estação no Redis.");
      }

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

    const estacaoExiste = await Estacao.findByPk(estacaoId);

    console.log(estacaoExiste);

    if (!estacaoExiste) {
      return res
        .status(404)
        .json({ erro: "Estação não encontrada no sistema." });
    }

    const ultimaLeitura = await redis.get(`estacao:${estacaoId}:ultima`);

    if (!ultimaLeitura) {
      return res.status(404).json();
    }

    return res.json(JSON.parse(ultimaLeitura));
  }
}

export default new LeiturasController();

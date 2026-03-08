import { Request, Response } from "express";
import { Op, Order, WhereOptions } from "sequelize";
import { parseISO } from "date-fns";

import buildRange from "../utils/buildRange.js";
import Leitura from "../models/Leitura.js";
import Estacao from "../models/Estacao.js";

interface Params {
  id: string;
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
  async index(req: Request<{}, {}, {}, Query>, res: Response) {
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
    const limit = Number(req.query.limit) || 25;

    let where: WhereOptions = {};
    let order: Order = [];

    // temperatura exata
    if (temperatura) {
      where = {
        ...where,
        temperatura: {
          [Op.eq]: Number(temperatura),
        },
      };
    }

    // temperatura range
    if (temperatura_min || temperatura_max) {
      const temperaturaRange = buildRange(temperatura_min, temperatura_max);

      if (temperaturaRange) {
        where = { ...where, temperatura: temperaturaRange };
      }
    }

    // umidade exata
    if (umidade) {
      where = {
        ...where,
        umidade: {
          [Op.eq]: Number(umidade),
        },
      };
    }

    // umidade range
    if (umidade_min || umidade_max) {
      const umidadeRange = buildRange(umidade_min, umidade_max);

      if (umidadeRange) {
        where = { ...where, umidade: umidadeRange };
      }
    }

    // pressão exata
    if (pressao_atmosferica) {
      where = {
        ...where,
        pressao_atmosferica: {
          [Op.eq]: Number(pressao_atmosferica),
        },
      };
    }

    // pressão range
    if (pressao_atmosferica_min || pressao_atmosferica_max) {
      const pressaoRange = buildRange(
        pressao_atmosferica_min,
        pressao_atmosferica_max
      );

      if (pressaoRange) {
        where = { ...where, pressao_atmosferica: pressaoRange };
      }
    }

    // vento exato
    if (velocidade_vento) {
      where = {
        ...where,
        velocidade_vento: {
          [Op.eq]: Number(velocidade_vento),
        },
      };
    }

    // vento range
    if (velocidade_vento_min || velocidade_vento_max) {
      const ventoRange = buildRange(
        velocidade_vento_min,
        velocidade_vento_max
      );

      if (ventoRange) {
        where = { ...where, velocidade_vento: ventoRange };
      }
    }

    // precipitação exata
    if (precipitacao) {
      where = {
        ...where,
        precipitacao: {
          [Op.eq]: Number(precipitacao),
        },
      };
    }

    // precipitação range
    if (precipitacao_min || precipitacao_max) {
      const precipitacaoRange = buildRange(
        precipitacao_min,
        precipitacao_max
      );

      if (precipitacaoRange) {
        where = { ...where, precipitacao: precipitacaoRange };
      }
    }

    // filtro por data
    if (criadaAntes || criadaDepois) {
      const data_leitura: Record<symbol, Date> = {};

      if (criadaAntes) {
        data_leitura[Op.lte] = parseISO(criadaAntes);
      }

      if (criadaDepois) {
        data_leitura[Op.gte] = parseISO(criadaDepois);
      }

      where = { ...where, data_leitura };
    }

    // ordenação dinâmica
    if (sort) {
      order = sort
        .split(",")
        .map((item) => item.split(":") as [string, "ASC" | "DESC"]);
    }

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
}

export default new LeiturasController();

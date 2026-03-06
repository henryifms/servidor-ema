import { Request, Response } from "express";
import { Op, Order, WhereOptions } from "sequelize";

interface Query {
  temperatura?: number,
  temperatura_min?: number,
  temperatura_max?: number,
  umidade?: number,
  umidade_min?: number,
  umidade_max?: number,
  pressao_atmosferica?: number,
  pressao_atmosferica_min?: number,
  pressao_atmosferica_max?: number,
  velocidade_vento?: number,
  velocidade_vento_min?: number,
  velocidade_vento_max?: number
  precipitacao?: number
  precipitacao_min?: number,
  precipitacao_max?: number,
  data_leitura?: number,
  data_leitura_min?: number,
  data_leitura_max?: number,
  sort?: string,
  page?: string,
  limit?: string
}

class LeiturasController {
  index(req: Request<{}, {}, {}, Query>, res: Response) {
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
      data_leitura,
      data_leitura_min,
      data_leitura_max,
      sort,
    } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 25;

    let where: WhereOptions = {};
    let order: Order = [];

    if (temperatura) {
      where = {
        ...where,
        temperatura: {
          [Op.eq]: temperatura,
        }
      }
    }

    if (temperatura_min && temperatura_max) {
      const temperaturaRange = buildRange(temperatura_min, temperatura_max)
      if (temperaturaRange) {
        where.temperatura = temperaturaRange
      }

    }

    if (umidade_min && umidade_max) {
      const umidadeRange = buildRange(umidade_min, umidade_max)
      if (umidadeRange) {
        where.umidade = umidadeRange
      }
    }
  }
}

export default new LeiturasController();

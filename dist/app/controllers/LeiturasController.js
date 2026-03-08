import { Op } from "sequelize";
import buildRange from "../utils/buildRange.js";
class LeiturasController {
    index(req, res) {
        const { temperatura, temperatura_min, temperatura_max, umidade, umidade_min, umidade_max, pressao_atmosferica, pressao_atmosferica_min, pressao_atmosferica_max, velocidade_vento, velocidade_vento_min, velocidade_vento_max, precipitacao, precipitacao_min, precipitacao_max, data_leitura, data_leitura_min, data_leitura_max, sort, } = req.query;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 25;
        let where = {};
        let order = [];
        if (temperatura) {
            where = {
                ...where,
                temperatura: {
                    [Op.eq]: Number(temperatura),
                }
            };
        }
        if (temperatura_min || temperatura_max) {
            const temperaturaRange = buildRange(temperatura_min, temperatura_max);
            if (temperaturaRange) {
                where.temperatura = temperaturaRange;
            }
        }
        if (umidade) {
            where = {
                ...where,
                umidade: {
                    [Op.eq]: Number(umidade),
                }
            };
        }
        if (umidade_min || umidade_max) {
            const umidadeRange = buildRange(umidade_min, umidade_max);
            if (umidadeRange) {
                where.umidade = umidadeRange;
            }
        }
        if (pressao_atmosferica) {
            where = {
                ...where,
                umidade: {}
            };
        }
    }
}
export default new LeiturasController();
//# sourceMappingURL=LeiturasController.js.map
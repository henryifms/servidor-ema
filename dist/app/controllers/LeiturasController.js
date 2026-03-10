import * as Yup from "yup";
import construirRange from "../utils/construirRange.js";
import construirOrdenacao from "../utils/construirOrdenacao.js";
import construirIntervaloData from "../utils/construirIntervaloData.js";
import adicionarFiltroExato from "../utils/adicionarFiltroExato.js";
import Leitura from "../models/Leitura.js";
import Estacao from "../models/Estacao.js";
class LeiturasController {
    async index(req, res) {
        const { temperatura, temperatura_min, temperatura_max, umidade, umidade_min, umidade_max, pressao_atmosferica, pressao_atmosferica_min, pressao_atmosferica_max, velocidade_vento, velocidade_vento_min, velocidade_vento_max, precipitacao, precipitacao_min, precipitacao_max, criadaAntes, criadaDepois, sort, } = req.query;
        const page = Number(req.query.page) || 1;
        const limit = Math.min(Number(req.query.limit) || 25, 100);
        const where = {};
        let order = [];
        // filtros exatos
        adicionarFiltroExato(where, "temperatura", temperatura);
        adicionarFiltroExato(where, "umidade", umidade);
        adicionarFiltroExato(where, "pressao_atmosferica", pressao_atmosferica);
        adicionarFiltroExato(where, "velocidade_vento", velocidade_vento);
        adicionarFiltroExato(where, "precipitacao", precipitacao);
        // ranges
        const temperaturaRange = construirRange(temperatura_min, temperatura_max);
        if (temperaturaRange)
            where.temperatura = temperaturaRange;
        const umidadeRange = construirRange(umidade_min, umidade_max);
        if (umidadeRange)
            where.umidade = umidadeRange;
        const pressaoRange = construirRange(pressao_atmosferica_min, pressao_atmosferica_max);
        if (pressaoRange)
            where.pressao_atmosferica = pressaoRange;
        const ventoRange = construirRange(velocidade_vento_min, velocidade_vento_max);
        if (ventoRange)
            where.velocidade_vento = ventoRange;
        const precipitacaoRange = construirRange(precipitacao_min, precipitacao_max);
        if (precipitacaoRange)
            where.precipitacao = precipitacaoRange;
        // filtro por data
        const data = construirIntervaloData(criadaAntes, criadaDepois);
        if (data)
            where.data_leitura = data;
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
    async show(req, res) {
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
    async create(req, res) {
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
        const novaLeitura = await Leitura.create({
            estacao_id: req.estacaoId,
            ...req.body,
            data_leitura: new Date(),
        });
        return res.status(201).json(novaLeitura);
    }
}
export default new LeiturasController();
//# sourceMappingURL=LeiturasController.js.map
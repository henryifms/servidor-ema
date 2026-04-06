import { Router } from "express";
import leituras from "../app/controllers/LeiturasController.js";
import apiKey from "../app/middlewares/apiKeys.js";

const routes = Router();

/**
 * @swagger
 * tags:
 *   - name: Leituras
 *     description: Dados meteorológicos coletados
 */

/**
 * @swagger
 * /estacoes/{estacaoId}/leituras:
 *   get:
 *     summary: Lista leituras da estação
 *     tags: [Leituras]
 *     parameters:
 *       - in: path
 *         name: estacaoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de leituras
 */

routes.get("/estacoes/:estacaoId/leituras", leituras.index);
routes.get("/estacoes/:estacaoId/leituras/ultima", leituras.ultima);
routes.get("/estacoes/:estacaoId/leituras/:id", leituras.show);

/**
 * @swagger
 * /leituras:
 *   post:
 *     summary: Envia dados da estação (ingestão)
 *     tags: [Leituras]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               temperatura:
 *                 type: number
 *                 example: 25.5
 *               umidade:
 *                 type: number
 *                 example: 70
 *     responses:
 *       201:
 *         description: Leitura registrada com sucesso
 */

routes.post("/leituras", apiKey, leituras.create);

export default routes;

import { Router } from "express";
import estacoes from "../app/controllers/EstacoesController.js";
import authMiddleware from "../app/middlewares/auth.js";

const routes = Router();

/**
 * @swagger
 * tags:
 *   - name: Estacoes
 *     description: Gerenciamento de estações meteorológicas
 */

/**
 * @swagger
 * /estacoes:
 *   get:
 *     summary: Lista todas as estações
 *     tags: [Estacoes]
 *     responses:
 *       200:
 *         description: Lista de estações
 */

routes.get("/estacoes", estacoes.index);

/**
 * @swagger
 * /estacoes/{id}:
 *   get:
 *     summary: Busca estação por ID
 *     tags: [Estacoes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Estação encontrada
 */

routes.get("/estacoes/maisProxima", estacoes.distEstacao);
routes.get("/estacoes/:id", estacoes.show);

/**
 * @swagger
 * /estacoes:
 *   post:
 *     summary: Cria uma nova estação
 *     tags: [Estacoes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Estação criada com sucesso
 */
routes.post("/estacoes", authMiddleware, estacoes.create);
routes.put("/estacoes/:id", authMiddleware, estacoes.update);
routes.delete("/estacoes/:id", authMiddleware, estacoes.destroy);

export default routes;

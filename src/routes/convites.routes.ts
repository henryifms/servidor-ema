import { Router } from "express";
import convites from "../app/controllers/ConvitesController.js";
import { verificarProprietario } from "../app/middlewares/verificarProprietario.js";

const routes = Router();

/**
 * @swagger
 * tags:
 *   - name: Convites
 *     description: Sistema de convites para acesso às estações
 */

/**
 * @swagger
 * /estacoes/{estacaoId}/convites:
 *   post:
 *     summary: Solicita acesso a uma estação
 *     tags: [Convites]
 *     parameters:
 *       - in: path
 *         name: estacaoId
 *         required: true
 *     responses:
 *       200:
 *         description: Solicitação enviada
 */

routes.post("/estacoes/:estacaoId/convites", convites.solicitar);

routes.get(
  "/estacoes/:estacaoId/convites",
  verificarProprietario,
  convites.listar
);

/**
 * @swagger
 * /convites/{token}/aceitar:
 *   post:
 *     summary: Aceita um convite
 *     tags: [Convites]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *     responses:
 *       200:
 *         description: Convite aceito
 */

routes.post("/convites/:token/aceitar", convites.aceitar);
routes.post("/convites/:token/rejeitar", convites.rejeitar);

export default routes;

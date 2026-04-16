import { Router } from "express";
import convites from "../app/controllers/ConvitesController.js";
import auth from "../app/middlewares/auth.js";
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
routes.post("/estacoes/:estacaoId/convites", auth, convites.solicitar);

routes.get(
  "/estacoes/:estacaoId/convites",
  auth,
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
routes.get("/convites/:token/aceitar", auth, convites.aceitar);
routes.get("/convites/:token/rejeitar", auth, convites.rejeitar);

export default routes;

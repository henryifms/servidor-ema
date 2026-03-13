import { Router } from "express";

import authMiddleware from "../app/middlewares/auth.js";
import apiKey from "../app/middlewares/apiKeys.js";

import sessions from "../app/controllers/SessionsController.js";
import usuarios from "../app/controllers/UsuariosController.js";
import estacoes from "../app/controllers/EstacoesController.js";
import leituras from "../app/controllers/LeiturasController.js";
import password from "../app/controllers/PasswordController.js";
import convites from "../app/controllers/ConvitesController.js";

const routes = Router();

/*
AUTH
*/

routes.post("/sessions", sessions.create);

/*
USUÁRIOS
*/

routes.post("/usuarios", usuarios.create);

// REDEFINIÇÂO DE SENHA
routes.post("/password/forgot", password.forgot);
routes.post("/password/reset", password.reset);

/*
ROTAS PROTEGIDAS (JWT)
*/

routes.use(authMiddleware);

routes.get("/usuarios", usuarios.index);
routes.get("/usuarios/:id", usuarios.show);
routes.put("/usuarios/:id", usuarios.update);
routes.delete("/usuarios/:id", usuarios.destroy);

/*
ESTAÇÕES
*/

routes.get("/estacoes", estacoes.index);
routes.get("/estacoes/:id", estacoes.show);
routes.post("/estacoes", estacoes.create);
routes.put("/estacoes/:id", estacoes.update);
routes.delete("/estacoes/:id", estacoes.destroy);
//
//
//  Falta fazer essas rotas:
//    POST /estacoes/:estacaoId/solicitar-acesso
//    GET /estacoes/:estacaoId/solicitacoes
//    GET /estacoes/:estacaoId/membros
//    POST /convites/:token/aceitar
//    POST /convites/:token/recusar
//    DELETE /estacoes/:estacaoId/membros/:usuarioId
//    Job exemplo:
//
// InviteToStationJob
//
// Email:
//
// Henry quer acesso à estação EMA-01.
//
// Aceitar:
// https://api.com/convites/TOKEN/aceitar

routes.post("/estacoes/:estacaoId/convites", convites.solicitar);
routes.get("/estacoes/:estacaoId/convites", convites.index);
routes.post("/convites/:id/aceitar", convites.aceitar);
routes.post("/convites/:id/rejeitar", convites.rejeitar);

/*
LEITURAS
*/

routes.get("/estacoes/:estacaoId/leituras/ultima", leituras.ultima);
routes.get("/estacoes/:estacaoId/leituras", leituras.index);
routes.get("/estacoes/:estacaoId/leituras/:id", leituras.show);

/*
INGESTÃO DA ESTAÇÃO (API KEY)
*/

routes.post("/leituras", apiKey, leituras.create);

export default routes;

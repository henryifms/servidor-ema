import { Router } from "express";

import authMiddleware from "../app/middlewares/auth.js";
import apiKey from "../app/middlewares/apiKeys.js";

import sessions from "../app/controllers/SessionsController.js";
import usuarios from "../app/controllers/UsuariosController.js";
import estacoes from "../app/controllers/EstacoesController.js";
import leituras from "../app/controllers/LeiturasController.js";

const routes = Router();

/*
AUTH
*/

routes.post("/sessions", sessions.create);

/*
USUÁRIOS
*/

routes.post("/usuarios", usuarios.create);

/*
ROTAS PROTEGIDAS (JWT)
*/

routes.use(authMiddleware);

routes.get("/usuarios", usuarios.index);
routes.get("/usuarios/:id", usuarios.show);
routes.put("/usuarios/:id", usuarios.update);
routes.delete("/usuarios/:id", usuarios.destroy);
routes.post("/usuarios/:usuarioId/estacoes/:estacaoId", usuarios.adicionarEstacao);

/*
ESTAÇÕES
*/

routes.get("/estacoes", estacoes.index);
routes.get("/estacoes/:id", estacoes.show);
routes.post("/estacoes", estacoes.create);
routes.put("/estacoes/:id", estacoes.update);
routes.delete("/estacoes/:id", estacoes.destroy);

/*
LEITURAS
*/

routes.get("/estacoes/:estacaoId/leituras", leituras.index);
routes.get("/estacoes/:estacaoId/leituras/:id", leituras.show);

/*
INGESTÃO DA ESTAÇÃO (API KEY)
*/

routes.post("/leituras", apiKey, leituras.create);

export default routes;

import { Router } from "express";
import estacoes from "../app/controllers/EstacoesController.js";
import leituras from "../app/controllers/LeiturasController.js";

const routes = Router();

routes.get("/estacoes", estacoes.index);
routes.get("/estacoes/:id", estacoes.show);
routes.post("/estacoes", estacoes.create);
routes.put("/estacoes/:id", estacoes.update);

// leituras.get("/estacoes/:id/leituras", leituras.index);

export default routes;

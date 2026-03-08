import { Router } from "express";
import estacoes from "../app/controllers/EstacoesController.js";
const routes = Router();
routes.get("/estacoes", estacoes.index);
routes.get("/estacoes/:id", estacoes.show);
routes.post("/estacoes", estacoes.create);
routes.put("/estacoes/:id", estacoes.update);
// routes.get("/estacoes/:id/leituras", leituras.index);
export default routes;
//# sourceMappingURL=routes.js.map
import { Router } from "express";

import usuariosRoutes from "./usuarios.routes.js";
import estacoesRoutes from "./estacoes.routes";
import authRoutes from "./auth.routes.js";
import leiturasRoutes from "./leituras.routes.js";
import convitesRoutes from "./convites.routes.js";

const routes = Router();

routes.use(authRoutes);
routes.use(usuariosRoutes);
routes.use(estacoesRoutes);
routes.use(leiturasRoutes);
routes.use(convitesRoutes);

export default routes;

import { Router } from "express";
import sessions from "../app/controllers/SessionsController.js";
import usuarios from "../app/controllers/UsuariosController.js";

const routes = Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Autenticação e confirmação de conta
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza login do usuário
 *     description: Retorna um token JWT para autenticação nas rotas protegidas
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
routes.post("/login", sessions.create);

routes.get("/confirmar-email", usuarios.confirmarEmail);

export default routes;

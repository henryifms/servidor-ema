import { Router } from "express";
import usuarios from "../app/controllers/UsuariosController.js";
import authMiddleware from "../app/middlewares/auth.js";

const routes = Router();

/**
 * @swagger
 * tags:
 *   - name: Usuarios
 *     description: Gerenciamento de usuários
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 */

routes.get("/usuarios", authMiddleware, usuarios.index);

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, password]
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Henry Campos
 *               email:
 *                 type: string
 *                 example: henry@email.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */

routes.post("/usuarios", usuarios.create);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Busca usuário por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 */
routes.get("/usuarios/:id", authMiddleware, usuarios.show);
routes.put("/usuarios/:id", authMiddleware, usuarios.update);
routes.delete("/usuarios/:id", authMiddleware, usuarios.destroy);

routes.get("/usuarios/:id/aprovar", usuarios.aprovar);

export default routes;

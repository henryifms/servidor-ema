import { Router } from "express";

import authMiddleware from "../app/middlewares/auth.js";
import apiKey from "../app/middlewares/apiKeys.js";
import { verificarProprietario } from "../app/middlewares/verificarProprietario.js";

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

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Loga os usuários.
 *     tags: [Login]
 *     responses:
 *       200:
 *         description: Usuário logado
 */
routes.post("/login", sessions.create);

/*
USUÁRIOS
*/

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cria um usuário
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - password
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Henry Thomaz
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

// REDEFINIÇÂO DE SENHA

/**
 * @swagger
 * /password/esqueci-senha:
 *   post:
 *     summary: Envia email para redefinição de senha.
 *     tags: [Password]
 *     responses:
 *       200:
 *         description: Email enviado
 */
routes.post("/password/esqueci-senha", password.forgot);
/**
 * @swagger
 * /password/reset:
 *   post:
 *     summary: Reseta a senha.
 *     tags: [Password]
 *     responses:
 *       200:
 *         description: Senha resetada
 */
routes.post("/password/reset", password.reset);

/*
ROTAS PROTEGIDAS (JWT)
*/

routes.use(authMiddleware);

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuários.
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
routes.get("/usuarios", usuarios.index);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Busca um usuário por id
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 */
routes.get("/usuarios/:id", usuarios.show);

/**
 * @swagger
 * /usuarios/:id:
 *   put:
 *     summary: Atualiza um usuário.
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Usuario atualizado
 */
routes.put("/usuarios/:id", usuarios.update);

/**
 * @swagger
 * /usuarios/:id:
 *   delete:
 *     summary: Deleta um usuário.
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Usuario deletado
 */
routes.delete("/usuarios/:id", usuarios.destroy);

/*
ESTAÇÕES
*/

/**
 * @swagger
 * /estacoes:
 *   get:
 *     summary: Lista todas as estações
 *     tags: [Estacoes]
 *     security:
 *       - bearerAuth: []
 */

routes.get("/estacoes", estacoes.index);

/**
 * @swagger
 * /estacoes/:id:
 *   get:
 *     summary: Lista uma estação pelo id.
 *     tags: [Estacoes]
 *     responses:
 *       200:
 *         description: Estação encontrada
 */
routes.get("/estacoes/:id", estacoes.show);

/**
 * @swagger
 * /estacoes:
 *   post:
 *     summary: Cria uma estação.
 *     tags: [Estacoes]
 *     responses:
 *       201:
 *         description: Estação criada
 */
routes.post("/estacoes", estacoes.create);

/**
 * @swagger
 * /estacoes/:id:
 *   put:
 *     summary: Atualiza um estação.
 *     tags: [Estacoes]
 *     responses:
 *       200:
 *         description: Estação atualizada
 */
routes.put("/estacoes/:id", estacoes.update);

/**
 * @swagger
 * /estacoes/:id:
 *   delete:
 *     summary: Deleta uma estação.
 *     tags: [Estacoes]
 *     responses:
 *       200:
 *         description: Estação deletada
 */
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

/**
 * @swagger
 * /estacoes/:estacaoId/convites:
 *   post:
 *     summary: Solicita um convite por email para o Proprietário de uma Estação.
 *     tags: [Convites]
 *     responses:
 *       200:
 *         description: Email enviado
 */
routes.post("/estacoes/:estacaoId/convites", convites.solicitar);

/**
 * @swagger
 * /estacoes/:estacaoId/convites:
 *   get:
 *     summary: Lista todos os convites da estação.
 *     tags: [Convites]
 *     responses:
 *       200:
 *         description: Convites encontrados
 */
routes.get(
  "/estacoes/:estacaoId/convites",
  verificarProprietario,
  convites.listar
);

/**
 * @swagger
 * /convites/:token/aceitar:
 *   post:
 *     summary: Aceita um convite.
 *     tags: [Convites]
 *     responses:
 *       200:
 *         description: Convite aceito
 */
routes.post("/convites/:token/aceitar", convites.aceitar);

/**
 * @swagger
 * /convites/:token/rejeitar:
 *   post:
 *     summary: Rejeita um convite.
 *     tags: [Convites]
 *     responses:
 *       200:
 *         description: Convite rejeitado
 */
routes.post("/convites/:token/rejeitar", convites.rejeitar);

/*
LEITURAS
*/

routes.get("/estacoes/:estacaoId/leituras/ultima", leituras.ultima);
routes.get("/estacoes/:estacaoId/leituras", leituras.index);
routes.get("/estacoes/:estacaoId/leituras/:id", leituras.show);

/*
INGESTÃO DA ESTAÇÃO (API KEY)
*/

/**
 * @swagger
 * /leituras:
 *   post:
 *     summary: Envia leitura da estação
 *     tags: [Leituras]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               temperatura:
 *                 type: number
 *                 example: 25.5
 *               umidade:
 *                 type: number
 *                 example: 70
 *               pressao_atmosferica:
 *                 type: number
 *                 example: 1013
 *               velocidade_vento:
 *                 type: number
 *                 example: 12
 *               precipitacao:
 *                 type: number
 *                 example: 0
 *     responses:
 *       201:
 *         description: Leitura registrada
 */

routes.post("/leituras", apiKey, leituras.create);

export default routes;

import { Request, Response } from "express";
import { Order, WhereOptions } from "sequelize";
import * as Yup from "yup";

import Usuario from "../models/Usuario.js";
import Estacao from "../models/Estacao.js";

import adicionarFiltroLike from "../utils/adicionarFiltroLike.js";
import construirIntervaloData from "../utils/construirIntervaloData.js";
import construirOrdenacao from "../utils/construirOrdenacao.js";

import Queue from "../../lib/Queue.js";
import WelcomeEmailJob from "../jobs/WelcomeEmailJob.js";

interface UsuarioIdParam {
  id: string
}

interface UsuarioEstacaoParams {
  usuarioId: string
  estacaoId: string
}

interface Query {
  nome?: string,
  email?: string,
  criadoAntes?: string,
  criadoDepois?: string,
  atualizadoAntes?: string,
  atualizadoDepois?: string,
  sort?: string,
  page?: string,
  limit?: string,
}

class UsuariosController {
  async index(req: Request<{}, {}, {}, Query>, res: Response) {
    const {
      nome,
      email,
      criadoAntes,
      criadoDepois,
      atualizadoAntes,
      atualizadoDepois,
      sort,
    } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 25, 100);

    const where: WhereOptions = {};

    adicionarFiltroLike(where, "nome", nome);
    adicionarFiltroLike(where, "email", email);

    const criado = construirIntervaloData(criadoAntes, criadoDepois);
    if (criado) (where as any).criado_em = criado;

    const atualizado = construirIntervaloData(atualizadoAntes, atualizadoDepois);
    if (atualizado) (where as any).atualizado_em = atualizado;

    const usuarios = await Usuario.findAll({
      where,
      attributes: ["id", "nome", "email"],
      include: [
        {
          model: Estacao,
          as: "estacoes",
          attributes: ["id", "nome"],
        },
      ],
      order: construirOrdenacao(sort),
      limit,
      offset: (page - 1) * limit,
    });

    return res.json(usuarios);
  }

  async show(req: Request<UsuarioIdParam>, res: Response) {
    const usuario = await Usuario.findByPk(req.params.id, {
      include: [
        {
          model: Estacao,
          as: "estacoes",
          attributes: ["id", "nome"],
        },
      ],
    });

    if (!usuario) {
      return res.status(404).json();
    }

    return res.json(usuario);
  }

  async create(req: Request, res: Response) {
    const { body } = req;

    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(8),
      passwordConfirmation: Yup.string().oneOf(
        [Yup.ref("password")],
        "Senha não bate."
      ),
    });

    if (!(await schema.isValid(body))) {
      return res.status(400).json({ erro: "Erro ao validar schema." });
    }

    const usuarioExiste = await Usuario.findOne({
      where: { email: body.email },
    });

    if (usuarioExiste) {
      return res.status(409).json({
        erro: "Usuário com este email já existe.",
      });
    }

    const novoUsuario = await Usuario.create(body);

    const { id, nome, email } = novoUsuario;

    await Queue.add(WelcomeEmailJob.key, { nome, email });
    return res.status(201).json({ id, nome, email });
  }

  async update(req: Request<UsuarioIdParam>, res: Response) {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json();
    }

    const schema = Yup.object().shape({
      nome: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: "Erro ao validar schema." });
    }

    const usuarioAtualizado = await usuario.update(req.body);

    const { id, nome, email } = usuarioAtualizado;

    return res.json({ id, nome, email });
  }

  async destroy(req: Request<UsuarioIdParam>, res: Response) {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json();
    }

    await usuario.destroy();

    return res.json();
  }

  async adicionarEstacao(req: Request<UsuarioEstacaoParams>, res: Response) {
    const { usuarioId, estacaoId } = req.params;

    const usuario = await Usuario.findByPk(usuarioId);
    const estacao = await Estacao.findByPk(estacaoId);

    if (!usuario || !estacao) {
      return res
        .status(404)
        .json({ erro: "Usuário ou estação não encontrado." });
    }

    if (!req.userId) {
      return res.status(401).json({ erro: "Usuário não autenticado." });
    }

    if (Number(usuarioId) !== req.userId) {
      return res.status(403).json({ erro: "Sem permissão." });
    }

    console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(usuario)));

    await usuario.addEstacao(estacao);

    return res.status(204).send();
  }
}

export default new UsuariosController();

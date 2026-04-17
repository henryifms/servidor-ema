import { Request, Response } from "express";
import crypto from "crypto";
import { WhereOptions, Op } from "sequelize";
import * as Yup from "yup";

import Usuario from "../models/Usuario.js";
import Estacao from "../models/Estacao.js";

import adicionarFiltroLike from "../utils/adicionarFiltroLike.js";
import construirIntervaloData from "../utils/construirIntervaloData.js";
import construirOrdenacao from "../utils/construirOrdenacao.js";

import Queue from "../../lib/Queue.js";
import WelcomeEmailJob from "../jobs/WelcomeEmailJob.js";
import ConfirmarEmailJob from "../jobs/ConfirmarEmailJob.js";
import NovoUsuarioAdminJob from "../jobs/NovoUsuarioAdminJob.js";

interface UsuarioIdParam {
  id: string;
}

interface UsuarioEstacaoParams {
  usuarioId: string;
  estacaoId: string;
}

interface CaptchaResponse {
  success: boolean;
  hostname?: string;
  "error-codes"?: string[];
}

interface Query {
  nome?: string;
  email?: string;
  criadoAntes?: string;
  criadoDepois?: string;
  atualizadoAntes?: string;
  atualizadoDepois?: string;
  sort?: string;
  page?: string;
  limit?: string;
}

class UsuariosController {
  async index(req: Request, res: Response) {
    try {
      const schema = Yup.object({
        nome: Yup.string(),
        email: Yup.string(),
        criadoAntes: Yup.date(),
        criadoDepois: Yup.date(),
        atualizadoAntes: Yup.date(),
        atualizadoDepois: Yup.date(),
        sort: Yup.string(),
        page: Yup.number().min(1),
        limit: Yup.number().min(1).max(100),
      });

      const query = await schema.validate(req.query, {
        stripUnknown: true,
      });

      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 25;

      const where: WhereOptions = {};

      const and: any[] = [];

      adicionarFiltroLike(and, "nome", query.nome);
      adicionarFiltroLike(and, "email", query.email);

      const criado = construirIntervaloData(
        query.criadoAntes,
        query.criadoDepois
      );
      if (criado) and.push({ criado_em: criado });

      const atualizado = construirIntervaloData(
        query.atualizadoAntes,
        query.atualizadoDepois
      );
      if (atualizado) and.push({ atualizado_em: atualizado });

      if (and.length) {
        where[Op.and] = and;
      }

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
        order: construirOrdenacao(query.sort),
        limit,
        offset: (page - 1) * limit,
      });

      return res.json(usuarios);
    } catch (err: any) {
      return res.status(400).json({ erro: err.message });
    }
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
    const { captchaToken } = body;

    if (!captchaToken) {
      return res.status(400).json({ erro: "Captcha obrigatório" });
    }

    const captchaData = await this.validarCaptcha(captchaToken);

    if (!captchaData.success) {
      return res.status(400).json({ erro: "Captcha inválido" });
    }

    if (!captchaData.success) {
      return res.status(400).json({ erro: "Captcha inválido" });
    }

    // if (captchaData.hostname !== "localhost") {
    //   return res.status(400).json({ erro: "Domínio inválido" });
    // }

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

    const token = crypto.randomBytes(32).toString("hex");

    const novoUsuario = await Usuario.create({
      ...body,
      email_confirmado: false,
      aprovado: false,
      email_confirmacao_token: token,
    });

    const { id, nome, email } = novoUsuario;

    await Queue.add(ConfirmarEmailJob.key, {
      nome,
      email,
      token,
    });

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

  async confirmarEmail(req: Request, res: Response) {
    const { token } = req.query;

    const usuario = await Usuario.findOne({
      where: { email_confirmacao_token: token },
    });

    if (!usuario) {
      return res.status(400).json({ erro: "Token inválido" });
    }

    await usuario.update({
      email_confirmado: true,
      email_confirmacao_token: null,
    });

    await Queue.add(NovoUsuarioAdminJob.key, {
      nome: usuario.nome,
      email: usuario.email,
      userId: usuario.id,
    });

    return res.redirect("https://henryifms.github.io/projeto-ema/#/login");
  }
  async aprovar(req: Request, res: Response) {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json();
    }

    await usuario.update({
      aprovado: true,
    });

    return res.json({ mensagem: "Usuário aprovado!" });
  }

  async validarCaptcha(
    token: string
  ): Promise<{ success: boolean; hostname?: string }> {
    if (!token) return { success: false };

    try {
      const response = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `secret=${process.env.RECAPTCHA_SECRET}&response=${token}`,
        }
      );
      const data = await response.json();
      return {
        success: data.success === true,
        hostname: data.hostname,
      };
    } catch (error) {
      console.error("Erro ao verificar captcha:", error);
      return { success: false };
    }
  }
}

export default new UsuariosController();

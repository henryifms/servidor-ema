import Usuario from "../models/Usuario.js";
import jwt, { SignOptions } from "jsonwebtoken";
import { Request, Response } from "express";
import auth from "../../config/auth.js";

import Queue from "../../lib/Queue.js";
import WelcomeToBackJob from "../jobs/WelcomeToBackJob.js";

class SessionsController {
  async create(req: Request, res: Response) {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    if (!(await usuario.checkPassword(password))) {
      return res.status(401).json({ erro: "Senha incorreta." });
    }

    if (!usuario.email_confirmado) {
      console.log(usuario.email_confirmado);
      return res.status(401).json({
        erro: "Confirme seu email antes de acessar.",
      });
    }

    if (!usuario.aprovado) {
      return res.status(401).json({
        erro: "Aguardando aprovação do administrador.",
      });
    }

    const { id, nome } = usuario;

    await Queue.add(WelcomeToBackJob.key, { nome, email });

    return res.json({
      user: { id, nome, email },
      token: jwt.sign({ id }, auth.secret, {
        expiresIn: auth.expiresIn,
      } as SignOptions),
    });
  }
}

export default new SessionsController();

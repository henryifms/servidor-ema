import { Request, Response } from "express";
import crypto from "crypto";
import * as Yup from "yup";

import Usuario from "../models/Usuario.js";

import redis from "../../lib/redis.js";
import Queue from "../../lib/Queue.js";
import ResetPasswordJob from "../jobs/ResetPasswordJob.js";

class PasswordController {
  async forgot(req: Request, res: Response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: "Erro ao validar schema." });
    }

    const { email } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    const token = crypto.randomBytes(20).toString("hex");

    await redis.set(`reset:${token}`, String(usuario.id), { EX: 60 * 60 });

    await Queue.add(ResetPasswordJob.key, {
      email: usuario.email,
      token,
    });

    return res.json({ message: "Email enviado" });
  }

  async reset(req: Request, res: Response) {
    const { token } = req.query;
    const { password } = req.body;

    const userId = await redis.get(`reset:${token}`);

    if (!userId) {
      return res.status(400).json({ erro: "Token inválido ou expirado" });
    }

    const usuario = await Usuario.findByPk(userId);

    if (!usuario) {
      return res.status(404).json();
    }

    await usuario.update({ password });

    await redis.del(`reset:${token}`);

    return res.json({ message: "Senha atualizada" });
  }
}

export default new PasswordController();

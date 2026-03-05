import Usuario from "../models/Usuario.js";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { Request, Response } from "express";

import auth from "../../config/auth.js";

class SessionsController {
  async create(req: Request, res: Response) {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({
      where: { email },
    });

    if (!usuario) {
      return res.status(404).json({ erro: "Usuario não encontrado." })
    }

    if (!(await usuario.checkPassword(password))) {
      return res.status(404).json({ erro: "Senha incorreta." })
    }

    const { id, nome } = usuario;

    return res.json({
      user: {
        id, nome, email,
      },
      token: jwt.sign({ id }, auth.secret as Secret , {
        expiresIn: auth.expiresIn,
      } as SignOptions),
    });
  }
}

export default new SessionsController();

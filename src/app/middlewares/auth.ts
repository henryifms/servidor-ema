import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import auth from "../../config/auth.js";

interface JwtPayload {
  id: string;
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: "Token não foi fornecido." });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ erro: "Token mal formatado." });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return res.status(401).json({ erro: "Token não foi fornecido." });
  }

  try {
    const decoded = jwt.verify(token, auth.secret) as unknown as JwtPayload;
    req.userId = decoded.id;
    return next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ erro: "Token inválido." });
  }
};

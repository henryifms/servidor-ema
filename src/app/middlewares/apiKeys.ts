import { Request, Response, NextFunction } from "express";
import Estacao from "../models/Estacao.js";

export default async function apiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ erro: "API key não enviada." });
  }

  const estacao = await Estacao.findOne({
    where: { api_key: apiKey },
  });

  if (!estacao) {
    return res.status(401).json({ erro: "API key inválida." });
  }

  req.estacaoId = estacao.id;

  return next();
}

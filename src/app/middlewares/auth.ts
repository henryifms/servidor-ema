import jwt from "jsonwebtoken";
import { promisify } from "util";

import auth from "../../config/auth.js";

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: "Token não foi fornecido." })
  }
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ erro: "Token mal formatado." });
  }

  const [, token ] = authHeader.split(" ");

  try {
    const decoded = await promisify(jwt.verify)(token, auth.secret);

    req.userId = decoded.id;

    return next();
  } catch (erro) {
    return res.status(401).json({ erro: "Token invalido." });
  }
};

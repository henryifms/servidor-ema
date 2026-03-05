import jwt from "jsonwebtoken";
import auth from "../../config/auth.js";
export default async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(400).json({ erro: "Token não foi fornecido." });
    }
    if (!authHeader.startsWith("Bearer ")) {
        return res.status(400).json({ erro: "Token mal formatado." });
    }
    const [, token] = authHeader.split(" ");
    try {
        const decoded = jwt.verify(token, auth.secret);
        req.userId = decoded.id;
        return next();
    }
    catch (erro) {
        return res.status(400).json({ erro: "Token invalido." });
    }
};

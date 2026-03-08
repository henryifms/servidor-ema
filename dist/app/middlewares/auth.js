import jwt from "jsonwebtoken";
import auth from "../../config/auth.js";
export default async (req, res, next) => {
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
        const decoded = jwt.verify(token, auth.secret);
        req.userId = decoded.id;
        return next();
    }
    catch (erro) {
        return res.status(401).json({ erro: "Token inválido." });
    }
};
//# sourceMappingURL=auth.js.map
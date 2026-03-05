import Usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";
import auth from "../../config/auth.js";
class SessionsController {
    async create(req, res) {
        const { email, password } = req.body;
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(404).json({ erro: "Usuario não encontrado." });
        }
        if (!(await usuario.checkPassword(password))) {
            return res.status(404).json({ erro: "Senha incorreta." });
        }
        const { id, nome } = usuario;
        return res.json({
            user: { id, nome, email },
            token: jwt.sign({ id }, auth.secret, {
                expiresIn: auth.expiresIn,
            }),
        });
    }
}
export default new SessionsController();

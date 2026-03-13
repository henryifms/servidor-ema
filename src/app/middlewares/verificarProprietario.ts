import Estacao from "../models/Estacao.js";

export async function verificarProprietario(req, res, next) {
  const { estacaoId } = req.params;
  const usuarioId = req.userId;

  const estacao = await Estacao.findByPk(estacaoId);

  if (!estacao) {
    return res.status(404).json({ erro: "Estação não encontrada" });
  }

  if (estacao.usuario_proprietario_id !== usuarioId) {
    return res.status(403).json({ erro: "Acesso negado" });
  }

  next();
}

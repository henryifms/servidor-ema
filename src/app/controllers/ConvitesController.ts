import Queue from "../../lib/Queue.js";
import NotificarProprietarioJob from "../jobs/NotificarProprietarioJob.js";

import Estacao from "../models/Estacao.js";
import Usuario from "../models/Usuario.js";

interface SolicitarParams {
  estacaoId: string;
}

class ConvitesController {
  async solicitar(req: Request<SolicitarParams>, res: Response) {
    const { estacaoId } = req.params;
    const usuarioId = req.userId;

    const estacao = await Estacao.findByPk(estacaoId);

    if (!estacao) {
      return res.status(404).json();
    }

    const conviteExistente = await ConviteEstacao.findOne({
      where: {
        usuario_id: usuarioId,
        estacao_id: estacaoId,
      },
    });

    if (conviteExistente) {
      return res.status(409).json({
        erro: "Convite já solicitado",
      });
    }

    const convite = await ConviteEstacao.create({
      usuario_id: usuarioId,
      estacao_id: estacaoId,
      status: "PENDENTE",
    });

    await Queue.add(NotificarProprietarioJob.key, {
      estacaoId,
      usuarioId,
    });

    return res.status(201).json(convite);
  }

  async aceitar(req: Request, res: Response) {
    const convite = await ConviteEstacao.findByPk(req.params.id);

    if (!convite) {
      return res.status(404).json();
    }

    await convite.update({
      status: "ACEITO",
    });

    await UsuarioEstacao.create({
      usuario_id: convite.usuario_id,
      estacao_id: convite.estacao_id,
      papel: "MEMBRO",
    });

    return res.json();
  }
  async aceitar(req, res) {

    const convite = await ConviteEstacao.findOne({
      where: { token: req.params.token },
    });

    if (!convite) {
      return res.status(404).json();
    }

    await convite.update({
      status: "ACEITO",
    });

    await UsuarioEstacao.create({
      usuario_id: convite.usuario_id,
      estacao_id: convite.estacao_id,
      papel: "MEMBRO",
    });

    return res.json();
  }
}

export default new ConvitesController();

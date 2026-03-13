import { Request, Response } from "express";
import Queue from "../../lib/Queue.js";
import NotificarProprietarioJob from "../jobs/NotificarProprietarioJob.js";
import crypto from "crypto";

import Estacao from "../models/Estacao.js";
import ConviteEstacao from "../models/ConviteEstacao.js";
import UsuarioEstacao from "../models/UsuarioEstacao.js";

interface Params {
  estacaoId: string;
}

class ConvitesController {
  async solicitar(req: Request<Params>, res: Response) {
    const { estacaoId } = req.params;
    const usuarioId = req.userId;

    const token = crypto.randomUUID();

    const estacao = await Estacao.findByPk(estacaoId);

    if (!estacao) {
      return res.status(404).json();
    }

    if (estacao.usuario_proprietario_id === usuarioId) {
      return res.status(403).json({
        erro: "O proprietário não pode solicitar acesso à própria estação",
      });
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
      token,
    });

    await Queue.add(NotificarProprietarioJob.key, {
      estacaoId,
      usuarioId,
      conviteId: convite.id,
      token: convite.token,
    });

    return res.status(201).json(convite);
  }

  async aceitar(req: Request, res: Response) {
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

  async listar(req: Request<Params>, res: Response) {
    const { estacaoId } = req.params;

    const convites = await ConviteEstacao.findAll({
      where: { estacao_id: estacaoId },
    });

    if (!convites) {
      return res.status(404).json({ erro: "Nenhum convite" });
    }

    return res.json(convites);
  }

  async rejeitar(req: Request, res: Response) {
    const convite = await ConviteEstacao.findOne({
      where: { token: req.params.token },
    });

    if (!convite) {
      return res.status(404).json();
    }

    await convite.update({
      status: "REJEITADO",
    });

    return res.json();
  }
}

export default new ConvitesController();

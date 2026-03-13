import Mail from "../../lib/Mail.js";

import Estacao from "../models/Estacao.js";
import Usuario from "../models/Usuario.js";

class NotificarProprietarioJob {
  get key() {
    return "NotificarProprietarioJob";
  }

  async handle({ data }) {
    const { estacaoId, usuarioId } = data;

    const estacao = await Estacao.findByPk(estacaoId);
    const usuario = await Usuario.findByPk(usuarioId);

    await Mail.send({
      to: estacao.proprietario.email,
      subject: "Pedido de acesso à estação",
      html: `
      ${usuario.nome} solicitou acesso à estação ${estacao.nome}
      `,
    });
  }
}

export default new NotificarProprietarioJob();

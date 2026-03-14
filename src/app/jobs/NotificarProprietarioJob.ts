import Mail from "../../lib/Mail.js";

import Estacao from "../models/Estacao.js";
import Usuario from "../models/Usuario.js";

class NotificarProprietarioJob {
  get key() {
    return "NotificarProprietarioJob";
  }

  async handle({ data }) {
    const { estacaoId, usuarioId, token } = data;

    const estacao = await Estacao.findByPk(estacaoId);
    const usuarioSolicitante = await Usuario.findByPk(usuarioId);

    const proprietario = await Usuario.findByPk(
      estacao.usuario_proprietario_id
    );

    await Mail.send({
      to: proprietario.email,
      subject: "Pedido de acesso à estação",
      html: `
      <p>${usuarioSolicitante.nome} solicitou acesso à estação ${estacao.nome}</p>

      <p>
        <a href="http://localhost:3000/convites/${token}/aceitar">
          Aceitar acesso: 
        </a>
      </p>

      <p>
        <a href="http://localhost:3000/convites/${token}/rejeitar">
          Rejeitar acesso: 
        </a>
      </p>
      `,
    });
  }
}

export default new NotificarProprietarioJob();

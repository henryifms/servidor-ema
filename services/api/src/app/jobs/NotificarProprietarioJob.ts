import Mail from "../../lib/Mail.js";
import Estacao from "../models/Estacao.js";
import Usuario from "../models/Usuario.js";

interface NotificarProprietarioData {
  estacaoId: number;
  usuarioId: number;
  token: string;
}

class NotificarProprietarioJob {
  get key(): string {
    return "NotificarProprietarioJob";
  }

  async handle({ data }: { data: NotificarProprietarioData }): Promise<void> {
    const { estacaoId, usuarioId, token } = data;

    const estacao = await Estacao.findByPk(estacaoId);
    const usuarioSolicitante = await Usuario.findByPk(usuarioId);
    const proprietario = await Usuario.findByPk(
      estacao?.usuario_proprietario_id
    );

    if (!estacao || !usuarioSolicitante || !proprietario) {
      throw new Error("Dados inválidos para notificação do proprietário");
    }

    const baseUrl = process.env.URL;
    const acceptLink = `${baseUrl}/convites/${token}/aceitar`;
    const rejectLink = `${baseUrl}/convites/${token}/rejeitar`;

    await Mail.send({
      to: proprietario.email,
      subject: "Pedido de acesso à estação",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <p><strong>${usuarioSolicitante.nome}</strong> solicitou acesso à estação <strong>${estacao.nome}</strong>.</p>
          <div style="margin: 24px 0;">
            <a href="${acceptLink}"
               style="display: inline-block; padding: 10px 20px; background: #16a34a; color: #fff; border-radius: 8px; text-decoration: none; margin-right: 12px;">
               Aceitar acesso
            </a>
            <a href="${rejectLink}"
               style="display: inline-block; padding: 10px 20px; background: #dc2626; color: #fff; border-radius: 8px; text-decoration: none;">
               Rejeitar acesso
            </a>
          </div>
        </div>
      `,
    });
  }
}

export default new NotificarProprietarioJob();

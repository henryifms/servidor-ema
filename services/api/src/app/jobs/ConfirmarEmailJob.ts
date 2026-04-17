import Mail from "../../lib/Mail.js";
import "dotenv/config";

interface ConfirmarEmailData {
  nome: string;
  email: string;
  token: string;
}

class ConfirmarEmailJob {
  get key(): string {
    return "ConfirmarEmailJob";
  }

  async handle({ data }: { data: ConfirmarEmailData }): Promise<void> {
    const { nome, email, token } = data;
    const link = `${process.env.URL}/confirmar-email?token=${token}`;

    await Mail.send({
      to: email,
      subject: "Confirme seu e-mail",
      headers: {
        "ngrok-skip-browser-warning": "3000",
      },
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #16a34a;">Olá ${nome}</h1>
          <p>Clique no botão abaixo para confirmar sua conta:</p>
          <a href="${link}"
             style="display: inline-block; padding: 12px 24px; background: #16a34a; color: #fff; border-radius: 8px; text-decoration: none; font-weight: bold;">
             Confirmar e-mail
          </a>
          <p style="margin-top: 20px;">Ou copie o link:</p>
          <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 6px;">${link}</p>
        </div>
      `,
    });
  }
}

export default new ConfirmarEmailJob();

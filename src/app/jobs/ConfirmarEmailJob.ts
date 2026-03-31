import Mail from "../../lib/Mail.js";
import "dotenv/config";

class ConfirmarEmailJob {
  get key() {
    return "ConfirmarEmailJob";
  }

  async handle({ data }) {
    const { nome, email, token } = data;

    const link = `${process.env.URL}/confirmar-email?token=${token}`;

    await Mail.send({
      to: email,
      subject: "Confirme seu e-mail",
      headers: {
        "ngrok-skip-browser-warning": "3000",
      },
      html: `
        <h1>Olá ${nome} </h1>
        <p>Clique no botão abaixo para confirmar sua conta:</p>

        <a href="${link}" 
           style="display:inline-block;padding:10px 20px;background:#16a34a;color:#fff;border-radius:8px;text-decoration:none;">
           Confirmar e-mail
        </a>

        <p>Ou copie o link:</p>
        <p>${link}</p>
      `,
    });
  }
}

export default new ConfirmarEmailJob();

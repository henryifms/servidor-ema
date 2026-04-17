import Mail from "../../lib/Mail.js";
import "dotenv/config";

interface ResetPasswordData {
  email: string;
  token: string;
}

class ResetPasswordJob {
  get key(): string {
    return "ResetPasswordJob";
  }

  async handle({ data }: { data: ResetPasswordData }): Promise<void> {
    const { email, token } = data;
    const url = `${process.env.URL}/password/reset?token=${token}`;

    await Mail.send({
      to: email,
      subject: "Redefinição de senha",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <p>Você solicitou a redefinição de senha.</p>
          <p>Clique no link abaixo para criar uma nova senha:</p>
          <a href="${url}"
             style="display: inline-block; padding: 10px 20px; background: #3b82f6; color: #fff; border-radius: 8px; text-decoration: none;">
             Redefinir senha
          </a>
          <p style="margin-top: 20px;">Ou copie o link:</p>
          <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 6px;">${url}</p>
        </div>
      `,
    });
  }
}

export default new ResetPasswordJob();

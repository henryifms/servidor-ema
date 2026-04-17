import Mail from "../../lib/Mail.js";
import "dotenv/config";

interface NovoUsuarioAdminData {
  nome: string;
  email: string;
  userId: number;
}

class NovoUsuarioAdminJob {
  get key(): string {
    return "NovoUsuarioAdminJob";
  }

  async handle({ data }: { data: NovoUsuarioAdminData }): Promise<void> {
    const { nome, email, userId } = data;
    const link = `${process.env.URL}/usuarios/${userId}/aprovar`;

    await Mail.send({
      to: process.env.ADMIN_EMAIL as string,
      subject: "Novo usuário aguardando aprovação",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e293b;">Novo cadastro no sistema</h2>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p>Deseja aprovar este usuário?</p>
          <a href="${link}"
             style="display: inline-block; padding: 12px 24px; background: #16a34a; color: #fff; border-radius: 8px; text-decoration: none; font-weight: bold;">
             Aprovar usuário
          </a>
        </div>
      `,
    });
  }
}

export default new NovoUsuarioAdminJob();

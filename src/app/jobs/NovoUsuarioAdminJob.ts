import Mail from "../../lib/Mail.js";

class NovoUsuarioAdminJob {
  get key() {
    return "NovoUsuarioAdminJob";
  }

  async handle({ data }) {
    const { nome, email, userId } = data;

    const link = `https://suspensive-scarabaeoid-pattie.ngrok-free.dev/usuarios/${userId}/aprovar`;

    await Mail.send({
      to: process.env.ADMIN_EMAIL,
      subject: "Novo usuário aguardando aprovação",
      html: `
        <h2>Novo cadastro no sistema</h2>

        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Email:</strong> ${email}</p>

        <p>Deseja aprovar este usuário?</p>

        <a href="${link}"
           style="display:inline-block;padding:10px 20px;background:#16a34a;color:#fff;border-radius:8px;text-decoration:none;">
           Aprovar usuário
        </a>
      `,
    });
  }
}

export default new NovoUsuarioAdminJob();

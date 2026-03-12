import Mail from "../../lib/Mail.js";

interface ResetPasswordData {
  email: string;
  token: string;
}

class ResetPasswordJob {
  get key() {
    return "ResetPasswordJob";
  }

  async handle({ data }: { data: ResetPasswordData }) {
    const { email, token } = data

    const url = `http://localhost:3000/password/reset?token=${token}`;

    await Mail.send({
      to: email,
      subject: "Redefinição de senha",
      html: `
        <p>Você solicitou redefinição de senha.</p>
        <p>Clique no link abaixo:</p>
        <a href="${url}">${url}</a>
      `,
    });
  }
}

export default new ResetPasswordJob();

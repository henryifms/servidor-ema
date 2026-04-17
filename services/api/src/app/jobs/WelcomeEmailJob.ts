import Mail from "../../lib/Mail.js";

interface WelcomeEmailData {
  nome: string;
  email: string;
}

class WelcomeEmailJob {
  get key(): string {
    return "WelcomeEmail";
  }

  async handle({ data }: { data: WelcomeEmailData }): Promise<void> {
    const { nome, email } = data;

    await Mail.send({
      to: email,
      subject: `Bem-vindo(a) ao EMA - ${email}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #16a34a;">Olá ${nome}!</h1>
          <p>Bem-vindo(a) ao sistema EMA. Estamos felizes em tê-lo(a) conosco.</p>
          <p>Explore suas funcionalidades e comece a gerenciar suas estações.</p>
          <hr style="margin: 24px 0; border-color: #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">Equipe EMA</p>
        </div>
      `,
      text: `Olá ${nome}. Bem-vindo(a) ao sistema EMA!`,
    });
  }
}

export default new WelcomeEmailJob();

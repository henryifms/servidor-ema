import Mail from "../../lib/Mail.js";

interface WelcomeToBackData {
  nome: string;
  email: string;
}

class WelcomeToBackJob {
  get key(): string {
    return "WelcomeToBackJob";
  }

  async handle({ data }: { data: WelcomeToBackData }): Promise<void> {
    const { nome, email } = data;

    await Mail.send({
      to: email,
      subject: `Bem-vindo(a) de volta! - ${email}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #16a34a;">Olá ${nome}!</h1>
          <p>Bem-vindo(a) de volta ao sistema EMA. Que bom revê-lo(a)!</p>
          <p>Acesse sua conta e continue de onde parou.</p>
          <hr style="margin: 24px 0; border-color: #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">Equipe EMA</p>
        </div>
      `,
      text: `Olá ${nome}. Bem-vindo(a) de volta ao sistema EMA!`,
    });
  }
}

export default new WelcomeToBackJob();

import Mail from "../../lib/Mail.ts";

class WelcomeMailJob {
  get key() {
    return "WelcomeEmail"
  }

  async handle({ data }) {
    const { nome, email } = data;

    Mail.send({
      to: email,
      subject: `Bem vindo(a) - ${email}`,
      html: `<h1> Olá ${nome}.</h1><p>Bem-vindo(a) ao sistema EMA!</p>`,
      text: `Olá ${nome}. Bem-vindo(a) ao sistema!`,
    });
  }
}

export default new WelcomeMailJob();

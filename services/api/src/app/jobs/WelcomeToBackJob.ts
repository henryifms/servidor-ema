import Mail from "../../lib/Mail";

class WelcomeToBackJob {
  get key() {
    return "WelcomeToBackJob";
  }

  async handle({ data }) {
    const { nome, email } = data;

    // console.log({ nome, email });

    await Mail.send({
      to: email,
      subject: `Bem vindo(a) de volta! - ${email}`,
      html: `<h1>Olá ${nome}.</h1><p>Bem vindo(a) de volta ao sistema EMA!</p>`,
      text: `Olá ${nome}. Bem vindo(a) de volta ao sistema EMA!`,
    });
  }
}

export default new WelcomeToBackJob();

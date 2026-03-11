import { Resend } from "resend";
import mailConfig from "../config/mail.js";

class Mail {
  constructor() {
    this.resend = new Resend(process.env.MAIL_API_TOKEN);
  }

  async send({ to, subject, html, text }) {
    return this.resend.emails.send({
      from: mailConfig.from,
      to,
      subject,
      html,
      text,
    });
  }
}

export default new Mail();

import { Resend } from "resend";
import mailConfig from "../config/mail.js";

class Mail {
  constructor() {
    this.resend = new Resend(process.env.MAIL_API_TOKEN);
  }

  async send({ to, subject, html, text }) {
    const response = await this.resend.emails.send({
      from: mailConfig.from,
      to,
      subject,
      html,
      text,
    });
    console.log("EMAIL RESPONSE:", response);
    return response;
  }
}

export default new Mail();

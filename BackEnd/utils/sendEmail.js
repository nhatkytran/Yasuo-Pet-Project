const path = require('path');
const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');

const {
  NODE_ENV,
  EMAIL_AUTHOR,
  MAILTRAP_HOST,
  MAILTRAP_PORT,
  MAILTRAP_USERNAME,
  MAILTRAP_PASSWORD,
  BREVO_HOST,
  BREVO_PORT,
  BREVO_KEY_NAME,
  BREVO_KEY_VALUE,
} = process.env;

class Email {
  constructor(user) {
    this.from = `Trần Nhật Kỳ < ${EMAIL_AUTHOR} >`;
    this.to = user.email;
    this.username = user.username || '';
  }

  newTransport() {
    if (NODE_ENV === 'development')
      return nodemailer.createTransport({
        host: MAILTRAP_HOST,
        port: MAILTRAP_PORT,
        auth: {
          user: MAILTRAP_USERNAME,
          pass: MAILTRAP_PASSWORD,
        },
      });

    return nodemailer.createTransport({
      host: BREVO_HOST,
      port: BREVO_PORT,
      auth: {
        user: BREVO_KEY_NAME,
        pass: BREVO_KEY_VALUE,
      },
    });
  }

  async send(options = {}) {
    const { template, subject, ...locals } = options;

    const html = pug.renderFile(
      path.join(__dirname, `../views/email/${template}.pug`),
      { subject, ...locals }
    );

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html, { wordwrap: null }),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome(options = {}) {
    const { oAuth, code } = options;

    const subject = oAuth
      ? ''
      : ' Your activate code (only valid for only 2 minutes)';

    await this.send({
      template: 'welcome',
      subject: `Welcome to Yasuo The King!${subject}`,
      username: this.username,
      code,
    });
  }

  async sendSolo(options = {}) {
    const { challengerName, challengerEmail, challengerMessage } = options;

    await this.send({
      template: 'solo',
      subject:
        'Solo Yasuo - Challenger! Whoever wins this battle becomes justice!',
      url: 'https://yasuo-the-king.netlify.app',
      challengerName,
      challengerEmail,
      challengerMessage,
    });
  }

  async sendActivateCode(code) {
    await this.send({
      template: 'activate',
      subject: 'Yasuo The King! Activate code',
      username: this.username,
      code,
    });
  }

  async sendForgotUsername() {
    await this.send({
      template: 'forgotUsername',
      subject: 'Yasuo The King! Username',
      username: this.username,
    });
  }

  async sendForgotPassword(code) {
    await this.send({
      template: 'forgotPassword',
      subject: 'Yasuo The King! Password reset code',
      username: this.username,
      code,
    });
  }

  async sendPurchasedSkinCode(options) {
    const { code, skinname } = options;

    await this.send({
      template: 'purchasedSkin',
      subject: 'Yasuo The King! ',
      username: this.username,
      skinname,
      code,
    });
  }
}

module.exports = Email;

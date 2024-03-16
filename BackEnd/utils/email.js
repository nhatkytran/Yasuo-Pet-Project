const nodemailer = require('nodemailer');

const { MAILTRAP_HOST, MAILTRAP_PORT, MAILTRAP_USERNAME, MAILTRAP_PASSWORD } =
  process.env;

const sendEmail = async ({ email, subject, message }) => {
  // 1. Create transporter
  const transporter = nodemailer.createTransport({
    host: MAILTRAP_HOST,
    port: MAILTRAP_PORT,
    auth: {
      user: MAILTRAP_USERNAME,
      pass: MAILTRAP_PASSWORD,
    },
  });

  // 2. Define email options
  const mailOptions = {
    from: 'Tran Nhat Ky < yasuotheking2@gmail.com >',
    to: email,
    subject,
    text: message,
  };

  // 3. Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

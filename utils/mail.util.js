const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
//   secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  const mailOption = {
    from: process.env.USER, // sender
    to, // receiver
    subject, // subject ("hello users")
    html, // html format
  };

  try {
    const mailTransport = await transporter.sendMail(mailOption);

    console.log("Email send:", mailTransport.response);

    return { success: true, message: mailTransport.response };

  } catch (error) {
    console.log("Email Error", error);
    throw new Error(`Failed to send email ${error.message}`);
  }
};

module.exports = sendEmail;

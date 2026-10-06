const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});
transporter.verify((error, success) => {
    if (error) {
        console.error("MAILER ERROR:", error);
    } else {
        console.log("MAIL SERVER READY");
    }
});

module.exports = transporter;
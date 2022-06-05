const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "14c9f367f5f928",
      pass: "6483541c2599d4"
    }
  });
const sendMail = () => {
    transport.sendMail({
        from: '"Disney Api" <disneyapi@example.com>',
        to: "example@example.com",
        subject: "Hola, esto es un challenge",
        html: "<b>Bienvenido a Disney api</b>"
    });
    console.log("Email enviado");
    return;
};
exports.sendMail = () => sendMail();

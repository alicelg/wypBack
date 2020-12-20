const nodemailer = require('nodemailer');

const sendEmail = (pMail) => {
    return new Promise((resolve, reject) => {
        // Definimos el transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: "watchyourpolitics@gmail.com",
                pass: "Alicehueleapis"
            }
        });

        // Definimos el email
        const mailOptions = {
            from: pMail.from,
            to: pMail.to,
            subject: pMail.subject,
            // text: pMail.text,
            html: pMail.html
        };

        // Enviamos el email
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) reject(error);
            resolve("Email sent")
        });
    });
}

module.exports = {
    sendEmail
}
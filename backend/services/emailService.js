const transporter = require('../config/mailer');

const sendEmail = (to, subject, html) => {
    return transporter.sendMail({
        from: 'no-reply@storylinematch.com',
        to,
        subject,
        html
    });
};

module.exports = { sendEmail };

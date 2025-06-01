const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'mail.storylinematch.com',
    port: 465,
    secure: true,
    auth: {
        user: 'no-reply@storylinematch.com',
        pass: process.env.PASS_EMAIL
    }
});

module.exports = transporter;

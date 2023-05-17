const nodemailer = require('nodemailer')
let aws = require("@aws-sdk/client-ses");

const ses = new aws.SES({
    apiVersion: "2010-12-01",
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.SES_ACCESS_KEY_ID,
        secretAccessKey: process.env.SES_SECRET_ACCESS_KEY
    }
});

const prepareTransport = () => {
    const smtpTransport = nodemailer.createTransport({
        SES: { ses, aws },
    });

    return smtpTransport;
}

/**
 * Send normal text or already rendered email.
 */
const sendPreparedEmail = async (toMail, subject, text, html, attachments) => {
    let smtpTrans = prepareTransport();

    let mailOptions = {};
    if (html) {
        mailOptions = {
            to: toMail,
            from: process.env.SENDER_EMAIL_ADDRESS,
            subject: subject,
            html: html,
            attachments: attachments
        };
    }

    if (text) {
        mailOptions = {
            to: toMail,
            from: process.env.SENDER_EMAIL_ADDRESS,
            subject: subject,
            text: text
        };
    }

    return new Promise(
        (resolve, reject) => {
            smtpTrans.sendMail(mailOptions, (err, info) => {
                if (err) {
                    reject(err);
                }
                resolve(info);
            });
        }
    );

}

module.exports = {
    sendPreparedEmail
}
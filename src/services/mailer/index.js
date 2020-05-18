import {emailAddress, emailPass} from "../../config/vars"

const nodemailer = require(`nodemailer`)

/**
 * Enviar emails
 * @param {*} config
 */
export default function sendMail({to, subject, text}) {
    const transporter = nodemailer.createTransport({
        service: `gmail`,
        auth: {
            user: emailAddress,
            pass: emailPass,
        },
    })
    transporter.sendMail({
        from: emailAddress,
        to: to,
        subject: subject,
        html: text,
    }, (err) => {
        // wiston
    })
}

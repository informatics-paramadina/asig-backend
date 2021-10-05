const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GAMIL_PASS,
    }
})

const mailer = async (from, to, subject, textBody)=>{
    const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: textBody
    }

    try {
        await transporter.sendMail(mailOptions)
        return "OK";
    } catch(e)
    {
        return e;
    }
}

module.exports = mailer;
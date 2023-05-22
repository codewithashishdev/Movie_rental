const users = require('./models/users.model')
const nodemailer = require('nodemailer')
const cron = require('node-cron')

const sendmailToAlluser = async (emailObj) => {

    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SEND_EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    let mailDetails = {
        from: process.env.SEND_EMAIL,
        to:emailObj,
        subject: "Movie Rental mail",
        text: "hi this is a movie rental task"
    };
    mailTransporter.sendMail(mailDetails, (err, info) => {
        if (err) {
            console.log(err)
        } else {
            console.log('Mail has been sent:-',info.response)
        }
    })

}

const sendmailAlluser = async () => {
    try {
        cron.schedule('*/20 * * * * *', async () => {
            const userdata = await users.findAll({ attributes: ['email'] })
            // console.log(userdata)
            if (userdata.length > 0) {

                const emails = []
                userdata.map((key) => {
                    emails.push(key.email)
                })
                sendmailToAlluser(emails)
            }
        })
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    sendmailAlluser
}
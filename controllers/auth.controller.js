const bcrypt = require('bcrypt')
const Joi = require('joi')
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const Users = require('../models/users.model')
const { Sequelize } = require('sequelize')
const otpGenerator = require('otp-generator');
const config = require('../config/database')
const cron = require('node-cron');
const twilio = require('twilio');
const { validateSignup,
    validateLogin,
    validateForgotpassword,
    validateResetpassword
} = require('../validation/userValidation')
const utils = require('../utils/authUtils')
const Logger = require('./logger.controller')



//signup controller
const signup = async (req, res) => {
    try {
        const existingUser = await Users.findOne({
            where: {
                email: req.body.email
            }
        })
        if (!existingUser) {
            const { error } = validateSignup(req.body)
            if (error) {
                Logger.authLogger.log('error', 'Validation Error "singup"',)
                return res.status(200).send({
                    is_error: true,
                    statusCode: 406,
                    message: error.details[0].message
                })
            } else {
                await Users.create(req.body)
                const user = await Users.findOne({
                    attributes: ['name', 'email', 'role', 'contact_no', 'address'],
                    where: {
                        email: req.body.email
                    },
                    raw: true
                })
                Logger.authLogger.log('info', 'User create Successfully')
                return res.status(201).send({
                    is_error: false,
                    statusCode: 201,
                    message: 'user created',
                    data: user
                })
            }
        } else {
            Logger.authLogger.log('info', 'User Already Exists','')
            res.status(200).send(utils.useralready)
        }
    } catch (error) {
        console.log(error)
        Logger.authLogger.log('error', 'Internal Server Error')
        return res.status(500).send(utils.catchObje)
    }
}

//login controller
const login = async (req, res) => {
    console.log(req.body)
    try {
        const { error } = validateLogin(req.body)
        if (error) {
            Logger.authLogger.log('error', 'Validation Error "login"')
            return res.status(200).send({
                is_error: true,
                statusCode: 406,
                message: error.details[0].message
            })
        } else {
            const user = await Users.findOne({
                where: {
                    email: req.body.email
                }
            })
            //compare password
            const compare = await bcrypt.compare(req.body.password, user.password)
            if (compare) {
                //token sign with email, role, and id
                const token = jwt.sign(
                    {
                        email: user.email,
                        role: user.role,
                        id: user.id
                    },
                    config.SECRET,
                    {
                        expiresIn: config.EXPIRE_TOKEN,
                    }
                );
                user.token = user;

                const User = await Users.findOne({
                    attributes: ['name', 'email', 'role', 'contact_no', 'address'],
                    where: {
                        email: req.body.email
                    }
                })
                //login response
                Logger.authLogger.log('info', 'User login Successfully "login"')
                return res.status(200).send({
                    is_error: false,
                    statusCode: 200,
                    message: 'login successfully',
                    data: User,
                    token: token
                })
            } else {
                Logger.authLogger.log('error', 'Wrong Password "login"')
                return res.status(200).send({
                    is_error: true,
                    statusCode: 403,
                    message: 'wrong password',
                    data: null,
                })
            }
        }
    } catch (error) {
        Logger.authLogger.log('error', 'Internal Server Error "login"')
        return res.status(500).send(utils.catchObje)
    }
}
//forgot controller using mobile
const forgotpasswordMoible = async (req, res) => {
    try {
        let userschema = Joi.object().keys({
            contact_no: Joi.number().required()
        })
        const error = userschema.validate(req.body).error
        if (error) {
            Logger.authLogger.log('error', 'Validation Error')
            return res.status(200).send({
                is_error: true,
                statusCode: 406,
                message: error.details[0].message
            })
        } else {
            const contact = await Users.findOne({
                contact_no: req.body.contact_no
            })
            if (contact) {
                const client = twilio("AC85f7a25f0483e8d8e00e77ce8cbbc223", "44b707ccff99c8958357474f12f3ce20");

                const senderNumber = '9510635154'; // Replace with your Twilio phone number

                // Set the recipient's phone number
                const recipientNumber = req.body.contact_no; // Replace with the recipient's phone number
                const otp = otpGenerator.generate(7, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
                // Compose the SMS message
                const message = `otp : ${otp}`;
                // Send the SMS
                client.messages
                    .create({
                        body: message,
                        from: senderNumber,
                        to: recipientNumber,
                    })
                    .then((message) => console.log(`SMS sent with SID: ${message.sid}`))
                    .catch((error) => console.error(error));
                return res.status(200).send({
                    is_error: false,
                    statusCode: 200,
                    message: 'Otp sended',
                    Otp: otp
                })
            }
        }
    } catch (error) {
        Logger.authLogger.log('error', 'Internal Server Error')
        return res.status(500).send(utils.catchObje)
    }
}
//forgotpassword controller
const forgotpassword = async (req, res) => {
    try {
        const { error } = validateForgotpassword(req.body)
        if (error) {
            Logger.authLogger.log('error', 'Validation Error "forgotpassword"')
            return res.status(200).send({
                is_error: true,
                statusCode: 406,
                message: error.details[0].message
            })
        } else {
            const user = await Users.findOne({
                where: {
                    email: req.body.email
                }
            })
            //generate otp
            const otp = otpGenerator.generate(7, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
            const user_otp = await Users.update({ otp: otp }, {
                where: {
                    email: req.body.email
                }
            })
            //gmail sender
            let mailTransporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.SEND_EMAIL,
                    pass: process.env.EMAIL_PASSWORD
                }
            });
            let mailDetails = {
                from: process.env.SEND_EMAIL,
                to: user.email,
                subject: "Forgot Password",
                html: `
                <div style="background-color: #f2f2f2; padding: 20px;">
                  <h1>Forgot Password </h1>
                  <p>Dear Sir/Ma'am,</p>
                  <p>We have received a request to forgot your password.</p>
                  <p>Please use the following One-Time Password (OTP) to reset your password:</p>
                  <h2><u>${otp}</u></h2>
                  <p>If you didn't request a password reset, you can ignore this email.</p>
                  <p>Best regards,</p>
                  <p>Movie Rentel</p>
                </div>
              `
            };

            mailTransporter.sendMail(mailDetails, function (err, data) {
                if (err) {
                    Logger.authLogger.log('error', 'Email is not Sended "forgotpassword"')
                    console.log(err)
                } else {
                    console.log(data)
                }
            })
            Logger.authLogger.log('info', 'Otp Sended By Your Email "forgotpassword"')
            return res.status(200).send({
                is_error: false,
                statusCode: 200,
                message: 'Otp sended',
                Otp: otp
            })
        }
    } catch (error) {
        Logger.authLogger.log('error', 'Internal Server Error "forgotpassword"')
        return res.status(500).send(utils.catchObje)
    }
}

//reset password controller
const resetpassword = async (req, res) => {
    try {
        const { error } = validateResetpassword(req.body)
        if (error) {
            Logger.authLogger.log('error', 'Validation Error "resetpassword"')
            return res.status(200).send({
                is_error: true,
                statuscode: 404,
                message: error.details[0].message
            })
        } else {
            const user = await Users.findOne({
                where: {
                    email: req.body.email
                }
            })
            if (!user) {
                Logger.authLogger.log('error', 'user is not exist "resetpassword"')
                return res.status(400).send({
                    is_error: false,
                    statusCode: 404,
                    message: 'user is not exist',
                })
            } else {
                if (req.body.otp === user.otp) {
                    //new password in hash convert
                    new_password = await bcrypt.hash(req.body.new_password, 10)
                    const user = await Users.update({ password: new_password }, {
                        where: {
                            email: req.body.email
                        }
                    })
                    Logger.authLogger.log('info', 'Password Changed Successfully "resetpassword"')
                    return res.status(200).send({
                        is_error: false,
                        statusCode: 200,
                        message: 'password changed'
                    })
                } else {
                    Logger.authLogger.log('error', 'Otp is Not Matched "resetpassword"')
                    return res.status(400).send({
                        is_error: false,
                        statusCode: 404,
                        message: 'Otp is not match'
                    })
                }
            }
        }
    } catch (error) {
        Logger.authLogger.log('error', 'Internal Server Error "resetpassword"')
        return res.status(500).send(utils.catchObje)
    }
}

//google login 
const google_user = async (req, res) => {
    try {
        //    return console.log(req.user);
        const name = req.user.profile._json.name
        const refreshToken = req.user.refreshToken
        const accessToken = req.user.accessToken
        const email = req.user.profile._json.email
        const socialId = req.user.profile.id
        const displayName = req.user.profile.displayName

        // Check if the user already exists in the database
        const existingUser = await Users.findOne({ email: email });
        if (existingUser) {
            // User already exists
        } else {
            // User doesn't exist, create a new user record
            const newUser = await Users.create({
                name: name,
                password: '',
                contact_no: 2,
                address: '',
                role: 'customer',
                socialId: socialId,
                name: displayName,
                email: email,
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        }
        res.redirect('/api/Dashboard')
    } catch (error) {
        res.redirect('/login');
    }
}

const dashboard = async (req, res) => {

    try {
        console.log(req.user)
        const accessToken = req.user.accessToken
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: accessToken });

        // Get the Gmail API client
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        // Retrieve the user's Gmail messages
        const response = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 10, // Adjust the number of results as needed
        });
        const messages = response.data.messages;
        // Retrieve the user's Gmail message by its ID
        const messagearray = []
        for (let index = 0; index < messages.length; index++) {
            const element = messages[index];

            const messageId = element.id;
            const response1 = await gmail.users.messages.get({
                userId: 'me',
                id: messageId,
            });
            const message = response1.data.snippet;
            messagearray.push(`----->${message}`)
        }
        res.send({
            message: messagearray
        })
    } catch (error) {
        Logger.authLogger.log('error', 'Internal Server Error "dashboard"')
        console.log(error)
        res.send({
            message: error.message
        })
    }
}

const cronJob = async () => {
    try {
        cron.schedule('*/10 * * * * *', dashboard(req, res));
    } catch (error) {
        Logger.authLogger.log('error', 'Internal Server Error "cronJob"')
        console.log(error)
    }
}

const Dashboard = async () => {
    try {
        cron.schedule('* * * * * *', async () => {
            dashboard(req, res)
        })
    } catch (error) {
        Logger.authLogger.log('error', 'Internal Server Error"Dashboard"')
        console.log(error)
    }
}

module.exports = {
    signup,
    login,
    forgotpasswordMoible,
    forgotpassword,
    resetpassword,
    google_user,
    dashboard,
    cronJob,
    Dashboard
}
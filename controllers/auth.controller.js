const bcrypt = require('bcrypt')
const Joi = require('joi')
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const Users = require('../models/users.model')
// const googleuser = require('../models/google.user.model')
const { Sequelize } = require('sequelize')
const otpGenerator = require('otp-generator');
const config = require('../config/database')
const cron = require('node-cron');
const twilio = require('twilio');


//signup controller
const signup = async (req, res) => {
    try {
        let userschema = Joi.object().keys({
            id: Joi.number(),
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            contact_no: Joi.number().integer().required(),
            address: Joi.string().required(),
            role: Joi.string().valid('customer', 'admin').required()
        })
        const existingUser = await Users.findOne({
            where: {
                email: req.body.email
            }
        })
        if (!existingUser) {
            const error = userschema.validate(req.body).error
            if (error) {
                return res.status(200).send({
                    is_error: true,
                    statusCode: 406,
                    message: error.details[0].message
                })
            } else {
                //bcrypt password hash
                req.body.password = await bcrypt.hash(req.body.password, 10);
                //create user
                await Users.create(req.body)
                const user = await Users.findOne({
                    attributes: ['name', 'email', 'role', 'contact_no', 'address'],
                    where: {
                        email: req.body.email
                    },
                    raw: true
                })
                console.log(user)
                // console.log(JSON.stringify(user))
                return res.status(201).send({
                    is_error: false,
                    statusCode: 201,
                    message: 'user created',
                    data: user
                })
            }
        } else {
            res.status(200).send({
                is_error: false,
                statusCode: 404,
                message: 'User already sign up',
                data: null
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            is_error: true,
            statusCode: 500,
            message: 'Internal server error'
        })
    }
}

//login controller
const login = async (req, res) => {
    console.log('jai ho gandhi ji')
    console.log(req.body)
    try {
        let userschema = Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })
        const error = userschema.validate(req.body).error
        if (error) {
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
            console.log(req.body)
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
                        expiresIn: "4h",
                    }
                );
                user.token = user;

                const User = await Users.findOne({
                    attributes: ['name', 'email', 'role', 'contact_no', 'address'],
                    where: {
                        email: req.body.email
                    }
                })

                //lgoin response
                return res.status(200).send({
                    is_error: false,
                    statusCode: 200,
                    message: 'login successfully',
                    data: User,
                    token: token
                })
            } else {
                return res.status(200).send({
                    is_error: true,
                    statusCode: 403,
                    message: 'wrong password',
                    data: null,
                })
            }
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            is_error: true,
            statusCode: 500,
            message: 'Internal server error'
        })
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

                // Set the sender's phone number (Twilio phone number)
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
        console.log(error)
        return res.status(500).send({
            is_error: true,
            statusCode: 500,
            message: 'Internal server error'
        })
    }
}
//forgotpassword controller
const forgotpassword = async (req, res) => {
    try {
        let userschema = Joi.object().keys({
            email: Joi.string().email().required()
        })
        const error = userschema.validate(req.body).error
        if (error) {
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
                    console.log(err)
                } else {
                    console.log(data)
                }
            })
            return res.status(200).send({
                is_error: false,
                statusCode: 200,
                message: 'Otp sended',
                Otp: otp
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            is_error: true,
            statusCode: 500,
            message: 'Internal server error'
        })
    }
}

//reset password controller
const resetpassword = async (req, res) => {
    try {
        let userschema = Joi.object().keys({
            email: Joi.string().email().required(),
            otp: Joi.string().required(),
            new_password: Joi.number().required()
        })
        const error = userschema.validate(req.body).error
        if (error) {
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
                    return res.status(200).send({
                        is_error: false,
                        statusCode: 200,
                        message: 'password changed '
                    })
                } else {
                    return res.status(400).send({
                        is_error: false,
                        statusCode: 404,
                        message: 'Otp is not match'
                    })
                }
            }
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            is_error: true,
            statusCode: 500,
            message: 'Internal server error'
        })
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
        console.log('+++++++++++++++++++++++++', existingUser)
        if (existingUser) {
            // User already exists, you can handle accordingly (e.g., update any changed details)
            console.log('User already exists:', existingUser);
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
            console.log('New user created:', newUser);
        }

        // res.send({
        //     data:{
        //         name: name,
        //         contact_no: 2,
        //         role: 'customer',
        //         address: '',
        //         accessToken: accessToken
        //     }
        // })
        // Redirect or send response to the client
        res.redirect('/api/Dashboard'); // Redirect to the specified success URL
    } catch (error) {
        console.error('Error processing Google authentication callback:', error);
        res.redirect('/login'); // Redirect to the specified failure URL
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
        console.log('+++++++++++++', response.data)

        const messages = response.data.messages;
        console.log('User Gmail messages:', messages);

        // Retrieve the user's Gmail message by its ID
        const messagearray = []
        for (let index = 0; index < messages.length; index++) {
            const element = messages[index];

            const messageId = element.id;
            console.log(messageId)
            const response1 = await gmail.users.messages.get({
                userId: 'me',
                id: messageId,
            });
            console.log(response1)
            const message = response1.data.snippet;
            messagearray.push(`----->${message}`)
            console.log('User Gmail message:', message);
        }

        console.log('mesage', messagearray)
        res.send({
            message: messagearray
        })
    } catch (error) {
        console.log(error)
        res.send({
            message: error.message
        })
    }
}

const cronJob = async () => { 
   try {
    cron.schedule('*/10 * * * * *', dashboard(req,res));
   } catch (error) {
    console.log(error)
   }
 }


const Dashboard = async () => {
    try {
        cron.schedule('* * * * * *', async () => {
            dashboard(req, res)
        })
    } catch (error) {
        console.log(error)
    }
}

//send all user mail
// authController.mail_sender()

module.exports = {
    signup,
    login,
    forgotpasswordMoible,
    forgotpassword,
    resetpassword,
    google_user,
    dashboard,
    cronJob
    // Dashboard,
    // mail_sender
}

// .custom(async (value, helpers) => {
//     const existingUser = await Users.findOne({ where: { contact_no: value } });
//     if (existingUser) {
//       return helpers.error('any.invalid');
//     }
//     return value;
//   }).messages({
//     'any.invalid': 'Contact number is already taken'
//   })
// .custom(async (value, helpers) => {
//     const existingUser = await Users.findOne({ where: { email: value } });
//     if (existingUser) {
//       return helpers.error('any.invalid');
//     }
//     return value;
//   }).messages({
//     'any.invalid': 'Email address is already taken'
//   })
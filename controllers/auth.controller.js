const bcrypt = require('bcrypt')
const Joi = require('joi')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const Users = require('../models/users.model')
const { Sequelize } = require('sequelize')
const otpGenerator = require('otp-generator');
const config = require('../config/database')

//signup controller
const signup = async (req, res) => {
    try {
        let userschema = Joi.object().keys({
            id: Joi.number(),
            name: Joi.string().required(),
            email: Joi.string().email().required().custom(async (value, helpers) => {
                const existingUser = await Users.findOne({ where: { email: value } });
                if (existingUser) {
                  return helpers.error('any.invalid');
                }
                return value;
              }).messages({
                'any.invalid': 'Email address is already taken'
              }),
            password: Joi.string().required(),
            contact_no: Joi.number().integer().required().custom(async (value, helpers) => {
                const existingUser = await Users.findOne({ where: { contact_no: value } });
                if (existingUser) {
                  return helpers.error('any.invalid');
                }
                return value;
              }).messages({
                'any.invalid': 'Contact number is already taken'
              })
            ,
            address: Joi.string().required(),
            role: Joi.string().valid('customer', 'admin').required()
        })
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
            const user =await Users.findOne({
                attributes :['name','email','role','contact_no','address'],
                where: {
                    email :req.body.email
                },
                raw :true
            })
            console.log(user)
            // console.log(JSON.stringify(user))
            return res.status(201).send({
                is_error: false,
                statusCode:201,
                message: 'user created',
                data: user
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(401).send({
            is_error: true,
            statusCode:401,
            message: 'Internal server error'
        })
    }
}

//login controller
const login = async (req, res) => {
    try {
        let userschema = Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })
        const error = userschema.validate(req.body).error
        if (error) {
            return res.status(200).send({
                is_error: true,
                statusCode:406,
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
                    attributes :['name','email','role','contact_no','address'],
                    where: {
                        email: req.body.email
                     }})

                //lgoin response
                return res.status(200).send({
                    is_error: false,
                    statusCode:200,
                    message: 'login successfully',
                    data: User,
                    token: token
                })
            } else {
                return res.status(200).send({
                    is_error: true,
                    statusCode:403,
                    message: 'wrong password',
                    data: null,
                })
            }
        }
    } catch (error) {
        console.log(error)
        return res.status(401).send({
            is_error: true,
            statusCode:401,
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
                statusCode:406,
                message: error.details[0].message
            })
        } else {
            const user = await Users.findOne({
                where: {
                    email: req.body.email
                }
            })
            //generate otp
            const otp = otpGenerator.generate(7, { upperCaseAlphabets: false, specialChars: false, alphabets: false });
            const user_otp = await Users.update({ otp: otp }, {
                where: {
                    email: req.body.email
                }
            })
            //gmail sender
            let mailTransporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: "codiottest@gmail.com",
                    pass: 'eufgexjkzczkmrya'
                }
            });
            let mailDetails = {
                from: "codiottest@gmail.com",
                to: user.email,
                subject: "ForgotPassword",
                text: `never share \nOTP : ${otp}`
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
                statusCode:200,
                message: 'Otp sended',
                Otp: otp
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(401).send({
            is_error: true,
            statusCode:401,
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
                statuscode:404,
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
                    statusCode:404,
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
                        statusCode:200,
                        message: 'password changed '
                    })
                } else {
                    return res.status(400).send({
                        is_error: false,
                        statusCode:404 ,
                        message: 'Otp is not match'
                    })
                }
            }
        }
    } catch (error) {
        console.log(error)
        return res.status(401).send({
            is_error: true,
            statusCode:401,
            message: 'Internal server error'
        })
    }
}

module.exports = {
    signup,
    login,
    forgotpassword,
    resetpassword
}
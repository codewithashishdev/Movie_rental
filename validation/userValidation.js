const Joi = require('joi');

//signup validation
const validateSignup = (data) => {
    const userschema = Joi.object().keys({
        id: Joi.number(),
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        contact_no: Joi.number().integer().required(),
        address: Joi.string().required(),
        role: Joi.string().valid('customer', 'admin').required()
    })
    return userschema.validate(data);
};

//login validation
const validateLogin = (data) => {
    const userschema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })

    return userschema.validate(data);
};

//forgotpasswprd validation
const validateForgotpassword = (data) => {
    const userschema = Joi.object().keys({
        email: Joi.string().email().required(),
    })

    return userschema.validate(data);
};

const validateResetpassword = (data) =>{
    let userschema = Joi.object().keys({
        email: Joi.string().email().required(),
        otp: Joi.string().required(),
        new_password: Joi.string().required()
    })
    return userschema.validate(data)
}


const validationupdateUser = (data) =>{
    let userschema = Joi.object().keys({
        name: Joi.string(),
        email: Joi.string().email(),
        contact_no: Joi.number().integer(),
        address: Joi.string()
    })
    return userschema.validate(data)
}
module.exports = {
    validateSignup,
    validateLogin,
    validateForgotpassword,
    validateResetpassword,
    validationupdateUser
};



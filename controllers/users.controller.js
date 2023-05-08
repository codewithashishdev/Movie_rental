const Users = require("../models/users.model")
const jwt = require('jsonwebtoken')
const Joi = require('joi')

//get user
const get_user = async (req, res) => {
    try {
        // console.log(req.id)
        const user = await Users.findOne({
            attributes: ['name', 'email', 'contact_no', 'address', 'role'],
            where: {
                email: req.id.email
            }
        });
        return res.status(200).send({
            is_login: true,
            message: 'get user',
            data: user
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            is_error: true,
            message: 'token error'
        })
    }
}

//edit user
const edit_user = async (req, res) => {
    try {
        console.log(req.id)
        const user = await Users.findOne({
            where: { email: req.id.email }
        })

        if (user) {
            let userschema = Joi.object().keys({
                name: Joi.string(),
                email: Joi.string().email(),
                contact_no: Joi.number().integer(),
                address: Joi.string()
            })
            const error = userschema.validate(req.body).error
            if (error) {
                return res.status(400).send({
                    is_error: true,
                    message: error.details[0].message
                })
            } else {
                await Users.update(req.body, {
                    where: { email: req.id.email }
                })
                return res.status(200).send({
                    is_error: false,
                    message: 'user updated',
                })
            }
        }

    } catch (error) {
        console.log(error)
        return res.status(400).send({
            is_error: true,
            message: 'token error'
        })
    }
}

//delete user
const delete_user = async (req, res) => {
    try {
        console.log(req.id)
        await Users.destroy({
            where: {
                email: req.id.email
            },
            force: true
        });
        return res.status(200).send({
            is_login: true,
            message: 'your user is deleted successfully',
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            is_error: true,
            message: 'token error'
        })
    }
}
module.exports = {
    get_user,
    edit_user,
    delete_user
}
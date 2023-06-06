const Users = require("../models/users.model")
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const { validationupdateUser } = require('../validation/userValidation')
const authorize = require('../permissions/permission');


//dashboard page
const dashboard = async (req, res) => {
    res.status(200).send('dashboaed page')
}

//admin page
const aadminDashbaoard = async(req,res) =>{
    res.status(200).send('admin page')

}

//get user
const get_user = async (req, res) => {
    try {
        console.log(req.id)
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
        const user = await Users.findOne({
            where: { email: req.id.email }
        })
        if (user) {
            const { error } = validationupdateUser(req.body)
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
            message: ''
        })
    }
}

//delete user
const delete_user = async (req, res) => {
    try {
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

//logout api
const logout = async (req, res) => {
    try {
        return res.status(200).send({
            message: 'logout successfully'
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            is_error: true,
            message: 'token error'
        })
    }
}

const alluser = async(req,res,next) =>{
    try {
        const user = await Users.findAll({
            attributes: ['name', 'email', 'contact_no', 'address', 'role'],
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

module.exports = {
    dashboard,
    aadminDashbaoard,
    get_user,
    edit_user,
    delete_user,
    logout,
    alluser
}
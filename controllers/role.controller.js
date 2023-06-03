const Role = require('../models/role.model')
const Joi = require('joi')

//add role
const addRole = async (req, res) => {
    try {
        let roleSchema = Joi.object().keys({
            role: Joi.string().required(),
            permissions: Joi.required()
        })
        const error = roleSchema.validate(req.body).error
        if (error) {
            return res.status(200).send({
                is_error: true,
                statusCode: 406,
                message: error.details[0].message
            })
        } else {
            const role = await Role.create(req.body)
            return res.status(201).send({
                is_error: false,
                statusCode: 201,
                message: 'role created',
                data: role
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).send('error')
    }

}

//get role 
const getRole = async (req, res) => {
try {
    
} catch (error) {
    
}
}

//get role by id
const getRolebyid = async (req, res) => {
try {
    
} catch (error) {
    
}
}

//edit role 
const editRole = async (req, res) => {
try {
    
} catch (error) {
    
}
}

//delet role
const deleteRole = async (req, res) => {
    try {
        const role = req.body.role
    } catch (error) {
        
    }
}

module.exports = {
    addRole,
    getRole,
    getRolebyid,
    editRole,
    deleteRole
}
const Permission = require('../models/permission.model')
const Joi = require('joi')
const Logger = require('./logger.controller')


//add permission
const addpermission = async (req, res) => {
    try {
        let roleSchema = Joi.object().keys({
            permission_id: Joi.number().required(),
            permissions_name: Joi.string().required()
        })
        const error = roleSchema.validate(req.body).error
        if (error) {
            Logger.authLogger.log('error', 'Validation error "addpermission"')
            return res.status(200).send({
                is_error: true,
                statusCode: 406,
                message: error.details[0].message
            })
        } else {
            const permision = await Permission.create(req.body)
            Logger.authLogger.log('info', 'Permission Created Successfully "addpermission"')
            return res.status(201).send({
                error: false,
                message: 'permission created successfully',
                permission: permision
            })
        }
    } catch (error) {
        console.log(error)
        Logger.authLogger.log('error', 'Internal Server Error "addpermission"')
        res.status(500).send({
            error: true,
            message: 'internal error'
        })
    }
}

//get permission 
const getpermission = async (req, res) => {
    try {
        const permision = await Permission.findAll()
        Logger.authLogger.log('info', 'Get Permissions Successfully "getpermission"')
        return res.status(200).send({
            error: false,
            message: 'all permission',
            permission: permision
        })
    } catch (error) {
        console.log(error)
        Logger.authLogger.log('error', 'Internal Server Error "getpermission"')
        res.status(500).send({
            error: true,
            message: 'internal error'
        })
    }
}

//get permission by id
const getpermissionbyid = async (req, res) => {
    try {
        let id = req.params.id
        const permision = await Permission.findOne({
            where: {
                permission_id: id
            }
        })
        Logger.authLogger.log('info', 'Get Permission Successfully "getpermissionbyid"')
        return res.status(200).send({
            error: false,
            message: ' get permission',
            permission: permision
        })
    } catch (error) {
        console.log(error)
        Logger.authLogger.log('error', 'Internal Server Error "getpermissionbyid"')
        res.status(500).send({
            error: true,
            message: 'internal error'
        })
    }
}

//edit permission 
const editpermission = async (req, res) => {
    try {
        let roleSchema = Joi.object().keys({
            permision_id: Joi.number(),
            permission_name: Joi.string()
        })
        const error = roleSchema.validate(req.body).error
        if (error) {
            Logger.authLogger.log('error', 'Validation error "editpermission"')
            return res.status(200).send({
                is_error: true,
                statusCode: 406,
                message: error.details[0].message
            })
        } else {
            let id = req.params.id
            const permision = await Permission.update(req.body, {
                where: {
                    permision_id: id
                }
            })
            Logger.authLogger.log('info', 'Permission Updated "editpermission"')
            return res.status(200).send({
                error: false,
                message: 'permission updated',
            })
        }
    } catch (error) {
        console.log(error)
        Logger.authLogger.log('error', 'Internal Server Error "editpermission"')
        res.status(500).send({
            error: true,
            message: 'internal error'
        })
    }
}

//delet permission
const deletepermission = async (req, res) => {
    try {
        let id = req.params.id
        const permision = await Permission.destroy({
            where: {
                permision_id: id
            }
        })
        Logger.authLogger.log('info', 'Permission Deleted "deletepermission"')
        return res.status(200).send({
            error: false,
            message: 'permission deleted',
        })
    } catch (error) {
        console.log(error)
        Logger.authLogger.log('error', 'Internal Server Error "deletepermission"')
        res.status(500).send({
            error: true,
            message: 'internal error'
        })
    }
}

module.exports = {
    addpermission,
    getpermission,
    getpermissionbyid,
    editpermission,
    deletepermission
}
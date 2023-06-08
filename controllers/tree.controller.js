
const Tree = require('../models/tree.model')
const Joi = require('joi')
const { Sequelize, Op } = require('sequelize');
const Logger = require('./logger.controller')


//add file
const addfile = async (req, res) => {
    try {
        let treeschema = Joi.object().keys({
            id: Joi.number(),
            name: Joi.string().required(),
            type: Joi.string().valid('file', 'folder').required(),
            perent: Joi.number(),
            child: Joi.string()
        })
        const error = treeschema.validate(req.body).error
        if (error) {
            Logger.authLogger.log('error','Validation Error "addfile"')
            return res.status(200).send({
                is_error: true,
                statusCode: 406,
                message: error.details[0].message
            })
        } else {
            if (!req.body.perent) {
                const tree = await Tree.create(req.body)
                Logger.authLogger.log('info','File Created "addfile"')
                return res.status(201).send({
                    error: false,
                    message: 'file or folder created successfully',
                    root: tree
                })
            } else {
                const tree1 = await Tree.findOne({
                    where: {
                        id: req.body.perent
                    }
                })
                if (tree1.type === 'folder') {
                    const tree = await Tree.create(req.body)
                    let demoArray = []
                    const treeArray = tree1.child
                    if (treeArray != null) {
                        for (let index = 0; index < treeArray.length; index++) {
                            const element = treeArray[index];
                            demoArray.push(element)
                        }
                    }
                    demoArray.push(tree.id)
                    const updatedTree = await Tree.update({
                        child: demoArray
                    },
                        {
                            where: {
                                id: tree.perent
                            }
                        })
                    Logger.authLogger.log('error','File Created "addfile"')
                    return res.status(201).send({
                        error: false,
                        message: 'file or folder created successfully',
                        root: tree
                    })
                } else {
                    Logger.authLogger.log('error','File not created "addfile"')
                    return res.status(201).send({
                        error: true,
                        message: 'Inside file you not create',
                        root: null
                    })
                }
            }
        }
    } catch (error) {
        console.log(error)
        Logger.authLogger.log('error','Internal Server Error "addfile"')
        return res.status(500).send({
            error: true,
            message: 'internal server error'
        })
    }
}

//get all file
const getallfile = async (req, res) => {
    try {
        const data = await Tree.findAll({
            attributes: ['id', 'name', 'type', 'perent', 'child']
        })
        const buildTree = (data, parentId = null) => {
            const tree = [];
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                if (element.perent === parentId) {
                    const children = buildTree(data, element.id);
                    if (children.length > 0) {
                        element.child = children;
                    }
                    tree.push(element);
                }
            }
            return tree;
        }
        const tree = buildTree(data, null);
        Logger.authLogger.log('info','All file and folder "getallfile"')
        return res.status(200).send({
            error: false,
            message: 'all file or folder',
            root: tree
        })
    } catch (error) {
        console.log(error)
        Logger.authLogger.log('error','Internal Server Error "getallfile"')
        return res.status(500).send({
            error: true,
            message: 'internal server error'
        })
    }
}

//edit file 
const editfile = async (req, res) => {
    try {
        let treeschema = Joi.object().keys({
            name: Joi.string(),
        })
        const error = treeschema.validate(req.body).error
        if (error) {
            Logger.authLogger.log('error','Validation Error "editfile"')
            return res.status(200).send({
                is_error: true,
                statusCode: 406,
                message: error.details[0].message
            })
        } else {
            let id = req.params.id

            await Tree.update(req.body, {
                where: {
                    id: id
                }
            })
        }
        Logger.authLogger.log('info','File Name is Updated "editfile"')
        return res.status(200).send({
            error: false,
            message: 'updated'
        })
    } catch (error) {
        console.log(error)
        Logger.authLogger.log('error','Internal Server Error  "editfile"')
        return res.status(500).send({
            error: true,
            message: 'internal server error'
        })
    }
}

//delete file
const deletefile = async (req, res) => {
    try {
        let id = req.params.id
        const deleteFile = async (id) => {
            const folder = await Tree.findOne({
                where: {
                    id: id
                }
            });
            await Tree.destroy({
                where: {
                    id: id
                }
            })
            if (folder.child != null) {
                const array = folder.child
                for (let index = 0; index < array.length; index++) {
                    const element = array[index];
                    deleteFile(element)
                }
            }
        };
        deleteFile(id)
        Logger.authLogger.log('info','File Deleted "deletefile"')
        return res.send({
            error: false,
            message: 'deleted'
        })

    } catch (error) {
        console.log(error)
        Logger.authLogger.log('error','Internal Server Error "deletefile"')
        return res.status(500).send({
            error: true,
            message: 'internal server error'
        })
    }
}

//get file by id
const getfilebyid = async (req, res) => {
    try {
        Logger.authLogger.log('info','WIP "getfilebyid"')
        return res.status(500).send({
            error: false,
            message: 'work in progress'
        })
    } catch (error) {
        console.log(error)
        Logger.authLogger.log('error','Internal Server Error "getfilebyid"')
        return res.status(500).send({
            error: true,
            message: 'internal server error'
        })
    }
}

module.exports = {
    addfile,
    getallfile,
    editfile,
    deletefile,
    getfilebyid
}

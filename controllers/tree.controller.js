
const Tree = require('../models/tree.model')
const Joi = require('joi')
const { Sequelize, Op } = require('sequelize');


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
            return res.status(200).send({
                is_error: true,
                statusCode: 406,
                message: error.details[0].message
            })
        } else {
            if (!req.body.perent) {
                const tree = await Tree.create(req.body)
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
                    return res.status(201).send({
                        error: false,
                        message: 'file or folder created successfully',
                        root: tree
                    })
                } else {
                    return res.status(201).send({
                        error: false,
                        message: 'Inside file you not create',
                        root: null
                    })
                }
            }
        }
    } catch (error) {
        console.log(error)
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
            data.forEach(item => {
                if (item.perent === parentId) {
                    const children = buildTree(data, item.id);
                    if (children.length > 0) {
                        item.child = children;
                    }
                    tree.push(item);
                }
            });
            return tree;
        }
        const tree = buildTree(data, null);
        return res.status(200).send({
            error: false,
            message: 'all file or folder',
            root: tree
        })
    } catch (error) {
        console.log(error)
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
        return res.status(200).send({
            error: false,
            message: 'updated'
        })
    } catch (error) {
        console.log(error)
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
        return res.send({
            error: false,
            message: 'deleted'
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            error: true,
            message: 'internal server error'
        })
    }
}

//get file by id
const getfilebyid = async (req, res) => {
    try {
        return res.status(500).send({
            error: false,
            message: 'work in progress'
        })
    } catch (error) {
        console.log(error)
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

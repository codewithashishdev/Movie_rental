
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
                const tree = await Tree.create(req.body)
                console.log('in side else')
                // console.log(tree1.id)
                const tree1 = await Tree.findOne({
                    where: {
                        id: req.body.perent
                    }
                })
                console.log(tree1.child)
                let demoArray = []
                const treeArray = tree1.child
                if (treeArray != null) {
                    for (let index = 0; index < treeArray.length; index++) {
                        const element = treeArray[index];
                        console.log(element)
                        demoArray.push(element)
                    }
                }
                console.log('=========', demoArray)
                // const updatefield = [tree1.child, tree.id]
                demoArray.push(tree.id)
                // return console.log(updatefield)
                const updatedTree = await Tree.update({
                    child: demoArray
                },
                    {
                        where: {
                            id: tree.perent
                        }
                    })
                // return console.log(tree.child)
                return res.status(201).send({
                    error: false,
                    message: 'file or folder created successfully',
                    root: updatedTree
                })
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

        const tree = await Tree.findAll({
            where: {
                perent: null
            }
        })
        console.log(tree[0].child)
        let childarray = tree[0].child
        let array = []
        if (childarray != null) {
            for (let index = 0; index < childarray.length; index++) {
                const element = childarray[index];
                console.log(element)
                const usintree = await Tree.findOne({
                    where: {
                        id: element
                    }
                })
                array.push(usintree)
            }
        }
        console.log(tree)

        tree.push(array)
        console.log(array)
        return res.status(200).send({
            error: false,
            message: 'all file or folder',
            tree: tree
        })

        // return res.status(200).send({
        //     error: false,
        //     message: 'all file or folder',
        //     root: tree
        // })
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

}

//delete file
const deletefile = async (req, res) => {

}

//get file by id
const getfilebyid = async (req, res) => {

}

module.exports = {
    addfile,
    getallfile,
    editfile,
    deletefile,
    getfilebyid
}


// const isParentNull = true
        // let whereClause = {};

        // if (isParentNull) {
        //     whereClause = {
        //         perent: null
        //     };
        // } else {
        //     whereClause = {
        //         [Op.not]: { perent: null }
        //     };
        // }

        // const tree = await Tree.findAll({
        //     where: whereClause
        // })
        // let root = []
        // await Tree.findAll({

        // })
        // const tree = await Tree.findAll()
        // console.log(tree.perent)
        // if (tree.perent == null) {
        //     root.push(tree)
        //     return res.status(200).send({
        //         error: false,
        //         message: 'all file or folder',
        //         root: tree
        //     })
        // } else {
        //     const tree1 = await Tree.findAll({
        //         where: {
        //             perent: tree.child
        //         }
        //     })
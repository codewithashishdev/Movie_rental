
const Tree = require('../models/tree.model')
const Joi = require('joi')
const { Sequelize, Op, json } = require('sequelize');


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
                console.log(tree1.type)
                if (tree1.type === 'folder') {
                    const tree = await Tree.create(req.body)
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
                    console.log('in side else')
                    // console.log(tree1.id)
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
            attributes:['id','name','type','perent','child']
         })
         const buildTree =(data, parentId = null)=> {
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
        //   console.log(tree);

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
                console.log(id)
               
                await Tree.update(req.body,{
                where:{
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
//     console.log(id)
//     const tree = await Tree.findAll()
//    console.log(tree)
   const deleteFile = async (id) => {
   
      const folder = await Tree.findOne({
        where:{
            id:id
        }
      });
      console.log(JSON.stringify(folder))
     
      await Tree.destroy({
        where:{
            id:id
        }
      })
      
      if (folder.child != null) {
        // console.log()
        const array = folder.child
       for (let index = 0; index < array.length; index++) {
        const element = array[index];
        console.log(element)
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


 // const tree = await Tree.findOne({
                //    where:{
                //     id: id
                //    }
                // })
                // return res.send(tree)

// const updateddata = []
// for (let index = 0; index < data.length; index++) {
//     const element = data[index];
// console.log(element)
// if(element.perent == null){
//     updateddata.push(element)
// } 
// // for () {
// //     const element = array[index];
    
// // }     
// }


// return res.status(200).send({
//     error: false,
//     message: 'all file or folder',
//     root: updateddata
// })
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


               // const tree = await Tree.findAll({
        //     where: {
        //         perent: null
        //     }
        // })
        // console.log(tree[0].child)
        // let childarray = tree[0].child
        // let array = []
        // if (childarray != null) {
        //     for (let index = 0; index < childarray.length; index++) {
        //         const element = childarray[index];
        //         console.log(element)
        //         const usintree = await Tree.findOne({
        //             where: {
        //                 id: element
        //             }
        //         })
        //         array.push(usintree)
        //     }
        // }
        // console.log(tree)

        // tree.push(array)
        // console.log(array)
        // return res.status(200).send({
        //     error: false,
        //     message: 'all file or folder',
        //     tree: tree
        // })

        // return res.status(200).send({
        //     error: false,
        //     message: 'all file or folder',
        //     root: tree
        // })

        
        // const trees = await Tree.findAll({
        //     attributes:['id','name','type','perent','child'],
        //     where: {
        //         perent : null
        //     },
        //     include: [
        //         {
        //             model: Tree,
        //             as: 'children',
        //             attributes:['id','name','type','perent','child'],
        //             where: {
        //                 perent: {
        //                     [Sequelize.Op.not]: null,
        //                 }
        //             }
        //         }
        //     ]
        // })

//             // res.send(tree)
//         let  array = []
//         let mainarray =[]
//         //element.child != null || 
//         for (let index = 0; index < tree.length; index++) {
//             const element = tree[index];
//             console.log(element)
//             if(element.perent == null){
//             array.push(element)
//             console.log(element)
//     }
// {   
// }}
// console.log(array)
// Create an empty object to store nodes by their IDs
// const nodes = {};

// Populate the object with nodes using their IDs as keys
// tree.forEach(item => {
//     const nodeId = item.id;
//     nodes[nodeId] = item;
// });

// Iterate over the data again to link child nodes to their parent nodes
// tree.forEach(item => {
//     const childIds = item.child;
//     if (childIds) {
//         const parent = nodes[item.id];
//         parent.child = childIds.map(childId => nodes[childId]);
//     }
// });
// console.log(nodes)
// data.forEach(element => {
//     console.log(element)
//     // const { id, name, type, perent, child } = element;
//     if(element.perent == null){
//         updateddata.push(element)
//     }else{
//         const parentFolder = updateddata[element.perent]
//         console.log('++++++',parentFolder)
//         if (parentFolder.child == element.perent) {
//             parentFolder.child.push(element);
//         }
//     }
//  });
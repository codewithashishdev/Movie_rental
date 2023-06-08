const express = require('express');
const router = express.Router();

//require file
const treeController = require('../controllers/tree.controller')
const middleware = require('../middlewares/Middleware.auth')
//add file or folder


router.post('/',middleware.authentication,treeController.addfile)

//get all files
router.get('/',middleware.authentication,treeController.getallfile)

//edit file name 
router.put('/:id',middleware.authentication,treeController.editfile)

//delete file and folder 
router.delete('/:id',middleware.authentication,treeController.deletefile)

//get folder by id
router.get('/:id',middleware.authentication,treeController.getfilebyid)

module.exports = router;

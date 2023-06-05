const express = require('express');
const router = express.Router();

//require file
const treeController = require('../controllers/tree.controller')

//add file or folder
router.post('/',treeController.addfile)

//get all files
router.get('/',treeController.getallfile)

//edit file name 
router.put('/:id',treeController.editfile)

//delete file and folder 
router.delete('/:id',treeController.deletefile)

//get folder by id
router.get('/:id',treeController.getfilebyid)

module.exports = router;

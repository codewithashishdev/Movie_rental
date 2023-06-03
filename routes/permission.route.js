const express = require('express');
const router = express.Router();

//import file
const permisionController  = require('../controllers/permission.controller')

//add permission
router.post('/',permisionController.addpermission)

//get permission 
router.get('/',permisionController.getpermission)

//get permission by id
router.get('/:id',permisionController.getpermissionbyid)

//edit permission
router.put('/:id',permisionController.editpermission)

//delet permissioin
router.delete('/:id',permisionController.deletepermission)

module.exports = router;

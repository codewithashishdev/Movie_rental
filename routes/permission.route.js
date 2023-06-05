const express = require('express');
const router = express.Router();

//import file
const permisionController = require('../controllers/permission.controller')
const middleware = require('../middlewares/Middleware.auth')
//add permission
router.post('/', middleware.adminmiddleware, permisionController.addpermission)

//get permission 
router.get('/', middleware.adminmiddleware, permisionController.getpermission)

//get permission by id
router.get('/:id', middleware.adminmiddleware, permisionController.getpermissionbyid)

//edit permission
router.put('/:id', middleware.adminmiddleware, permisionController.editpermission)

//delet permissioin
router.delete('/:id', middleware.adminmiddleware, permisionController.deletepermission)

module.exports = router;

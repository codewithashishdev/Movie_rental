const express = require('express');
const router = express.Router();


//import file
const roleController = require('../controllers/role.controller')

//add role
router.post('/',roleController.addRole)

//get all role
router.get('/',roleController.getRole)

//add role by id
router.get('/:id',roleController.getRolebyid)

//edit role by id
router.put('/:id',roleController.editRole)

//delete role by id
router.delete('/:id',roleController.deleteRole)


module.exports = router;

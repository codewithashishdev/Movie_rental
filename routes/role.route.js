const express = require('express');
const router = express.Router();


//import file
const roleController = require('../controllers/role.controller')
const middleware = require('../middlewares/Middleware.auth')
//add role
router.post('/', middleware.adminmiddleware, roleController.addRole)

//get all role
router.get('/', middleware.adminmiddleware, roleController.getRole)

//add role by id
router.get('/:id', middleware.adminmiddleware, roleController.getRolebyid)

//edit role by id
router.put('/:id', middleware.adminmiddleware, roleController.editRole)

//delete role by id
router.delete('/:id', middleware.adminmiddleware, roleController.deleteRole)


module.exports = router;

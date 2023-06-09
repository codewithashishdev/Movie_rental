const express = require('express');
const UserController = require('../controllers/users.controller');
const adminController = require('../controllers/admin.controller')
const roleController = require('../controllers/role.controller')
const Middleware = require('../middlewares/Middleware.auth')
const { authRole } = require('../middlewares/Middleware.auth')
const router = express.Router();
const { Role } = require('../utils/authUtils')


/* users listing. */

//dashboard
router.get('/dashboard',Middleware.authentication,Middleware.permission('read'),UserController.dashboard)

//get user
router.get('/', Middleware.authentication,Middleware.permission('get-user'),UserController.get_user)

//edit user
router.put('/', Middleware.authentication, Middleware.permission('edit-user'),UserController.edit_user)

//delet user
router.delete('/', Middleware.authentication, Middleware.permission('delete-user'),UserController.delete_user)

//all information 
router.get('/movies',adminController.all_information)
//, Middleware.adminmiddleware
//logout api
router.get('/logout', Middleware.authentication, UserController.logout)

//all user 
router.get('/alluser',Middleware.adminmiddleware,UserController.alluser)



module.exports = router;

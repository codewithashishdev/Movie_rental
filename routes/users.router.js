const express = require('express');
const UserController = require('../controllers/users.controller');
const adminController = require('../controllers/admin.controller')
const Middleware = require('../middlewares/Middleware.auth')
const { authRole } = require('../middlewares/Middleware.auth')
const router = express.Router();
const { Role } = require('../utils/authUtils')
const {canGetUser} = require('../permissions/user')


/* users listing. */
//, Middleware.userpermission
// dashboard
router.get('/dashboard', Middleware.isAuthenticated, UserController.dashboard)

// //admin
// router.get('/admin', Middleware.isAuthenticated, authRole(Role.Admin), UserController.aadminDashbaoard)

//get user
router.get('/', Middleware.authentication,Middleware.userpermission,UserController.get_user)

//edit user
router.put('/', Middleware.authentication, UserController.edit_user)

//delet user
router.delete('/', Middleware.authentication, UserController.delete_user)

//all information 
router.get('/movies', Middleware.adminmiddleware, adminController.all_information)

//logout api
router.get('/logout', Middleware.authentication, UserController.logout)

//all user 
router.get('/alluser',Middleware.adminmiddleware,UserController.alluser)

module.exports = router;

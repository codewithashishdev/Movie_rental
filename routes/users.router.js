const express = require('express');
const UserController = require('../controllers/users.controller');
const adminController = require('../controllers/admin.controller')
const Middleware = require('../middlerwares/Middleware.auth')
const router = express.Router();

/* users listing. */


//get user
router.get('/', Middleware.authentication ,UserController.get_user)

//edit user
router.put('/', Middleware.authentication ,UserController.edit_user)

//delet user
router.delete('/',Middleware.authentication,UserController.delete_user)

//all information 
router.get('/movies',Middleware.adminmiddleware,adminController.all_information)


module.exports = router;

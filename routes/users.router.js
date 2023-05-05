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
router.get('/allinformation',Middleware.authentication,adminController.all_information)

// which  user have perticular movie
router.get('/moviestoke',Middleware.authentication,adminController.moviestoke)


router.get('/this',Middleware.adminauthentication,adminController.moviestoke)

module.exports = router;

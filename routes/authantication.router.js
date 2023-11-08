const express = require('express');
const router = express.Router();
const loginController = require('../controllers/auth.controller')

/* authenticaation page. */
//signup api



//signup controller
router.post('/signup',loginController.signup)

//login api
router.post('/login',loginController.login)

//forgotpassowrd using mobile
router.post('/mobil-forgotpassword',loginController.forgotpasswordMoible)

//login api
//forgotpassword api
router.post('/forgotpassword',loginController.forgotpassword)

//reset password
router.post('/resetpassword',loginController.resetpassword)


module.exports = router;

const express = require('express');
const movieRentelController = require('../controllers/rentalMovie.controller')
const Middleware = require('../middlerwares/Middleware.auth')
const router = express.Router();

/* rentel_movie page. */

// movie rental 
router.post('/rentel',Middleware.authentication,movieRentelController.rental_movie)

//movie return
router.post('/return',Middleware.authentication,movieRentelController.return_movie)

module.exports = router;
const express = require('express');
const movieRentelController = require('../controllers/rentalMovie.controller')
const Middleware = require('../middlewares/Middleware.auth')
const router = express.Router();

/* rentel_movie page. */

// movie rental 
router.post('/rentel',Middleware.customermiddleware,movieRentelController.rental_movie)

//movie return
router.post('/return',Middleware.customermiddleware,movieRentelController.return_movie)

module.exports = router;
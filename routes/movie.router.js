const express = require('express');
const movieController = require('../controllers/movies.controller')
const Middleware = require('../middlerwares/Middleware.auth')
const router = express.Router();

/* movie page. */

//add movie
router.post('/', Middleware.authentication, movieController.add_movie)

//get movie
router.get('/', Middleware.authentication, movieController.get_movie)

//get movie by id
router.get('/:id', Middleware.authentication, movieController.movieBy_id)

//searching movie
router.get('/search/:search',Middleware.authentication,movieController.get_movieBy_serching)

//edit movie
router.put('/:id', Middleware.authentication, movieController.edit_movie)

//delete movie
router.delete('/:id',Middleware.authentication, movieController.delete_movie)


module.exports = router;
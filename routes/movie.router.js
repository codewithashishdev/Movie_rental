const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movies.controller')
const Middleware = require('../middlerwares/Middleware.auth')
const imagemiddleware= require('../middlerwares/upload.middleware')


/* movie page. */
router.use('/movie_title',express.static('upload'))
//add movie

router.post('/', Middleware.adminmiddleware,imagemiddleware.uploadimage,movieController.add_movie)

//get movie
router.get('/', Middleware.authentication, movieController.get_movie)

//get movie by id
router.get('/:id', Middleware.authentication, movieController.movieBy_id)

//searching movie
router.get('/search/:search', Middleware.authentication, movieController.get_movieBy_serching)

//edit movie
router.put('/:id', Middleware.adminmiddleware, movieController.edit_movie)

//delete movie
router.delete('/:id', Middleware.adminmiddleware, movieController.delete_movie)


module.exports = router;

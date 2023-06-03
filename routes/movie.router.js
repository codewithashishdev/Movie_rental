const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movies.controller')
const Middleware = require('../middlewares/Middleware.auth')
const imagemiddleware= require('../middlewares/upload.middleware')


/* movie page. */
router.use('/movie_title',express.static('upload'))
//add movie
//Middleware.adminmiddleware
router.post('/',Middleware.adminmiddleware,imagemiddleware.uploadimage,movieController.add_movie)

//get movie
router.get('/', Middleware.authentication,Middleware.permission('viewall-movie'), movieController.get_movie)

//get movie by id
router.get('/:id', Middleware.authentication, Middleware.permission('view-movie'),movieController.movieBy_id)

//searching movie
router.get('/search/:search', Middleware.authentication,Middleware.permission('viewall-movie') ,movieController.get_movieBy_serching)

//edit movie
router.put('/:id', Middleware.adminmiddleware,Middleware.permission('edit-movie') ,movieController.edit_movie)

//delete movie
router.delete('/:id',Middleware.permission('delete-movie') ,movieController.delete_movie)

//Middleware.adminmiddleware
module.exports = router;

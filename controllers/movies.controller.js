
const Movies = require('../models/movie.model')
const Users = require('../models/users.model')
const Joi = require('joi')
const { Op } = require("sequelize")
const jwt = require('jsonwebtoken')
const { validateAddMovie, validateEditMovie } = require('../validation/movieValidation')
const Logger = require('./logger.controller')


//add movie
const add_movie = async (req, res) => {
    try {
        const { error } = validateAddMovie(req.body)
        if (error) {
            res.status(200).send({
                is_error: true,
                message: error.details[0].message
            })
            Logger.authLogger.error(`message-${error.details[0].message} Url-${req.originalUrl} -Method ${req.method} Ip- ${req.ip},bowser - ${req.headers['user-agent']}`)
        } else {
            const data = req.body
            data.movie_title = `${process.env.URL}/movie/Movie_title/${req.file.filename}`
            const movie = await Movies.create(data)
            res.status(201).send({
                is_error: false,
                message: 'movie created',
                data: movie
            })
            Logger.authLogger.info(`message-${res.statusMessage} Url-${req.originalUrl} -Method ${req.method} Ip- ${req.ip},bowser - ${req.headers['user-agent']}`)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            is_error: true,
            message: 'Internal server error'
        })
        Logger.authLogger.error(`message-${res.statusMessage} Url-${req.originalUrl} -Method ${req.method} Ip- ${req.ip},bowser - ${req.headers['user-agent']}`)
    }
}


//get all movie
const get_movie = async (req, res) => {
    try {
        const movies = await Movies.findAll({
            attributes: ['id', 'movie_name', 'release_date', 'genre', 'price', 'quantity', 'movie_title']
        })
        res.status(200).send({
            is_error: false,
            message: 'all movie here',
            data: movies
        })
        Logger.authLogger.info(`message-${res.statusMessage} Url-${req.originalUrl} -Method ${req.method} Ip- ${req.ip},bowser - ${req.headers['user-agent']}`)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            is_error: true,
            message: 'Internal server error'
        })
        Logger.authLogger.error(`message-${res.statusMessage} Url-${req.originalUrl} -Method ${req.method} Ip- ${req.ip},bowser - ${req.headers['user-agent']}`)
    }
}
//get movie by id 
const movieBy_id = async (req, res) => {
    try {
        id = req.params.id
        if (!id) {
            res.status(500).send({
                is_error: true,
                message: 'id is require'
            })
            Logger.authLogger.error(`message-${res.statusMessage} Url-${req.originalUrl} -Method ${req.method} Ip- ${req.ip},bowser - ${req.headers['user-agent']}`)
        } else {
            const movie = await Movies.findOne({
                attributes: ['id', 'movie_name', 'release_date', 'genre', 'price', 'quantity', 'movie_title'],
                where: {
                    id: id
                }
            })
            res.status(200).send({
                is_error: true,
                data: movie
            })
            Logger.authLogger.info(`message-${res.statusMessage} Url-${req.originalUrl} -Method ${req.method} Ip- ${req.ip},bowser - ${req.headers['user-agent']}`)
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            is_error: true,
            message: 'Internal server error'
        })
        Logger.authLogger.info(`message-${res.statusMessage} Url-${req.originalUrl} -Method ${req.method} Ip- ${req.ip},bowser - ${req.headers['user-agent']}`)
    }
}

//get seraching movie
const get_movieBy_serching = async (req, res) => {
    try {
        let search = req.params.search
        if (!search) {
            Logger.authLogger.log('error', 'Enter Movie name properly "get_movieBy_serching"')
            return res.status(500).send({
                is_error: true,
                message: 'Enter value'
            })
        } else {
            const movie = await Movies.findAll({
                attributes: ['id', 'movie_name', 'release_date', 'genre', 'price', 'quantity', 'movie_title'],
                where: {
                    [Op.or]: [
                        { movie_name: { [Op.iLike]: `${search}%` } },
                    ]
                },
                raw: true
            })
            if (!movie) {
                Logger.authLogger.log('error', 'movie is not exits "get_movieBy_serching"')
                return res.status(200).send({
                    is_error: false,
                    message: 'movie is not exits'
                })
            } else {
                Logger.authLogger.log('info', 'Searched Movies "get_movieBy_serching"')
                return res.status(200).send({
                    is_error: false,
                    message: 'movie is here',
                    data: movie
                })
            }
        }
    } catch (error) {
        console.log(error)
        Logger.authLogger.log('error', 'Internal Server Error "get_movieBy_serching"')
        res.status(500).send({
            is_error: true,
            message: 'data is not get'
        })
    }
}

//edit movie
const edit_movie = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            Logger.authLogger.log('error', 'Id is Require "edit_movie"')
            return res.status(500).send({
                is_error: true,
                message: 'id is require'
            })
        } else {
            const { error } = validateEditMovie(req.body)
            if (error) {
                Logger.authLogger.log('error', 'Validation Error "edit_movie"')
                return res.status(200).send({
                    is_error: true,
                    message: error.details[0].message
                })
            } else {
                const movie = await Movies.update(req.body, {
                    where: {
                        id: req.params.id
                    }
                })
                Logger.authLogger.log('info', 'Movie Updated "edit_movie"')
                return res.status(200).send({
                    is_error: false,
                    message: 'movie updated',
                    data: movie
                })
            }
        }
    } catch (error) {
        console.log(error)
        Logger.authLogger.log('error', 'Internal Server Error "edit_movie"')
        return res.status(500).send({
            is_error: true,
            message: 'Internal server error'
        })
    }
}

//delete movie
const delete_movie = async (req, res) => {
    try {
        const movie = await Movies.destroy({
            where: {
                id: req.params.id
            }
        })
        Logger.authLogger.log('info', 'Movie Deleted "delete_movie"')
        return res.status(200).send({
            is_error: false,
            message: 'movie deleted',
            data: movie
        })

    } catch (error) {
        console.log(error)
        Logger.authLogger.log('error', 'Internal Server Error "delete_movie"')
        return res.status(500).send({
            is_error: true,
            message: 'Internal server error'
        })
    }
}

module.exports = {
    add_movie,
    get_movie,
    movieBy_id,
    get_movieBy_serching,
    edit_movie,
    delete_movie
}



       // if(req.file){
        //      console.log({
        //         success: true,
        //         movie_title :  `${process.env.URL}/movie/Movie_title/${req.file.filename}`,
        //     })
        // }
        // console.log(req.file)
        // console.log(req.body)
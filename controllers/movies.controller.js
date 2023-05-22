
const Movies = require('../models/movie.model')
const Users = require('../models/users.model')
const Joi = require('joi')
const { Op } = require("sequelize")
const jwt = require('jsonwebtoken')

//add movie
const add_movie = async (req, res) => {
    try {
        let movieschema = Joi.object().keys({
            id: Joi.number(),
            movie_name: Joi.string().required(),
            release_date: Joi.string().required(),
            genre: Joi.string().required(),
            price: Joi.number().required(),
            quantity: Joi.number().required(),
        })
        const error = movieschema.validate(req.body).error
        if (error) {
            return res.status(200).send({
                is_error: true,
                message: error.details[0].message
            })
        } else {
            const data = req.body
            data.movie_title = `${process.env.URL}/movie/Movie_title/${req.file.filename}`
            const movie = await Movies.create(data)
            return res.status(201).send({
                is_error: false,
                message: 'movie created',
                data: movie
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            is_error: true,
            message: 'Internal server error'
        })
    }
}


//get all movie
const get_movie = async (req, res) => {
    try {
        const movies = await Movies.findAll({
            attributes: ['id', 'movie_name', 'release_date', 'genre', 'price', 'quantity','movie_title']
        })
        return res.status(200).send({
            is_error: false,
            message: 'all movie here',
            data: movies
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            is_error: true,
            message: 'Internal server error'
        })
    }
}
//get movie by id 
const movieBy_id = async (req, res) => {
    try {
        id = req.params.id
        if (!id) {
            return res.status(500).send({
                is_error: true,
                message: 'id is require'
            })
        } else {
            const movie = await Movies.findOne({
                attributes: ['id', 'movie_name', 'release_date', 'genre', 'price', 'quantity','movie_title'],
                where: {
                    id: id
                }
            })
            return res.status(200).send({
                is_error: true,
                data: movie
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            is_error: true,
            message: 'Internal server error'
        })
    }
}

//get seraching movie
const get_movieBy_serching = async (req, res) => {
    try {
        let search = req.params.search
        console.log(search)

        if (!search) {
            return res.status(500).send({
                is_error: true,
                message: 'Enter value'
            })
        } else {
            const movie = await Movies.findAll({
                attributes: ['id', 'movie_name', 'release_date', 'genre', 'price', 'quantity','movie_title'],
                where: {
                    [Op.or]: [
                        { movie_name: { [Op.iLike]: `${search}%` } },
                        // {genre:{[Op.iLike]:`${search}`}}
                    ]
                },
                raw: true
            })
            console.log(movie)
            if (!movie) {
                return res.status(200).send({
                    is_error: false,
                    message: 'movie is not exits'
                })
            } else {
                return res.status(200).send({
                    is_error: false,
                    message: 'movie is here',
                    data: movie
                })
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            is_error: true,
            message: 'data is not get'
        })
    }
}

//edit movie
const edit_movie = async (req, res) => {
    try {
        const token = req.headers.authorization
        //token varify
        const id = jwt.verify(token, 'ashish');
        // const user = await Users.findOne({
        //     where: { email: id.email }
        // })
        if (id.role === 'admin') {
            const id = req.params.id
            if (!id) {
                return res.status(500).send({
                    is_error: true,
                    message: 'id is require'
                })
            } else {
                let movieschema = Joi.object().keys({
                    id: Joi.number(),
                    movie_name: Joi.string(),
                    release_date: Joi.string(),
                    genre: Joi.string(),
                    price: Joi.number(),
                    quantity: Joi.number(),
                })
                const error = movieschema.validate(req.body).error
                if (error) {
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
                    return res.status(200).send({
                        is_error: false,
                        message: 'movie updated',
                        data: movie
                    })
                }
            }
        } else {
            return res.status(500).send({
                is_error: true,
                message: 'user can not edit movie'
            })
        }
    } catch (error) {
        console.log(error)
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
        return res.status(200).send({
            is_error: false,
            message: 'movie deleted',
            data: movie
        })

    } catch (error) {
        console.log(error)
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
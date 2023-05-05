const Movie_Rental = require('../models/rentalMovie.model')
const Movies = require('../models/movie.model')
const Joi = require('joi')
const Users = require('../models/users.model')
const jwt = require('jsonwebtoken')
const Sequelize = require('sequelize')


//rentel movie
const rental_movie = async (req, res) => {
    try {

        // console.log("get user")
        if (!req.headers.authorization) {
            return res.status(401).json(
                {
                    error: "Not Authorized"
                });
        }
        const token = req.headers.authorization

        const id = jwt.verify(token, 'ashish');
        // console.log(id)
        const user = await Users.findOne({
            where: { email: id.email }
        })
        // console.log(JSON.stringify(user))
        // console.log('+++++++', user.role)
        if (user.role === 'customer') {

            let movieschema = Joi.object().keys({
                user_id: Joi.number().required(),
                Movie_id: Joi.number().required(),
                Day_of_rent: Joi.number().required(),
                Day_till_rent: Joi.number().required(),
                is_returned: Joi.boolean(),
            })
            // console.log('error')
            const error = movieschema.validate(req.body).error
            // console.log('error')
            if (error) {
                return res.status(400).send({
                    is_error: true,
                    message: error.details[0].message
                })
            } else {
                const movie_rentel = await Movie_Rental.create(req.body)
                const id = JSON.stringify(movie_rentel.Movie_id)
                // quantity minus in this movie
                const movie = Movies.update(
                    {
                        quantity: Sequelize.literal('quantity - 1')
                    },
                    {
                        where: { id: id },
                    }
                )

                return res.status(200).send({
                    is_error: false,
                    message: 'movie rented',
                    data: movie_rentel
                })

            }
        } else {
            return res.status(400).send({
                is_error: true,
                message: 'admin can not rentel movie'
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            is_error: true,
            message: 'token error'
        })
    }
}

//return movie
const return_movie = async (req, res) => {
    try {
        const token = req.headers.authorization
        //token varify
        const id = jwt.verify(token, 'ashish');
        console.log(id)
        const user = await Users.findOne({
            where: { email: id.email }
        })
        if (user.role === 'customer') {
            let movieschema = Joi.object().keys({
                user_id: Joi.number().required(),
                Movie_id: Joi.number().required(),
                Day_of_rent: Joi.number().required(),
                Day_till_rent: Joi.number().required(),
                is_returned: Joi.boolean(),
            })
            const error = movieschema.validate(req.body).error
            console.log('error')
            if (error) {
                return res.status(400).send({
                    is_error: true,
                    message: error.details[0].message
                })
            } else {
                const movie_rentel = await Movie_Rental.create(req.body)
                // quantity minus in this movie
                const id = JSON.stringify(movie_rentel.Movie_id)
                const movie = Movies.update({
                    quantity: Sequelize.literal('quantity + 1')
                },
                    {
                        where: { id: id },
                    })
                return res.status(200).send({
                    is_error: false,
                    message: 'movie return',
                    data: movie_rentel,
                })
            }
        } else {
            return res.status(400).send({
                is_error: true,
                message: 'admin can not return movie'
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).send({
            is_error: true,
            message: 'token error'
        })
    }
}
module.exports = {
    rental_movie,
    return_movie
}

const jwt = require('jsonwebtoken')
const Users = require('../models/users.model')
const movies = require('../models/movie.model')
const rental_movie = require('../models/rentalMovie.model')
const sequelize = require('sequelize')

// Admin can get users with full detail of all movies he rented and total of movies and money
const all_information = async (req, res) => {
    try {
        const token = req.headers.authorization
        //verify token
        const user = jwt.verify(token, 'ashish');
        if (user.role === 'admin') {
            const user = await Users.findAll({
                where: { role: 'customer' },
                include: [
                    {
                        model: rental_movie,
                        include: [{ model: movies, }]
                    }
                ]
            })
            return res.status(200).send({
                data: user
            })
        } else {
            return res.status(400).send({
                is_error: true,
                status: 400,
                message: 'customer is not allowed to view data',
                data: null
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(401).send({
            is_error: true,
            error: error,
            status: 400,
            message: 'not found',
            data: null
        })
    }
}

// rentel_movie by user
const moviestoke = async (req, res) => {
    const token = req.headers.authorization
    //verify token
    const id = jwt.verify(token, 'ashish');
    const user = await Users.findOne({
        where: { email: id.email }
    })
    if (user.role === 'admin') {
        const movie = await movies.findAll()
        const data = JSON.stringify(movie)
        return res.status(200).send({
            data: movie
        })
    }
}
module.exports = {
    all_information,
    moviestoke
}
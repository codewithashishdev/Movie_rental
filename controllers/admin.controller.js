
const jwt = require('jsonwebtoken')
const Users = require('../models/users.model')
const movies = require('../models/movie.model')
const rental_movie = require('../models/rentalMovie.model')
const sequelize = require('sequelize')

// Admin can get users with full detail of all movies he rented and total of movies
const all_information = async (req, res) => {
    try {
        const user = await Users.findAll({
            attributes: ['name', 'email', 'contact_no', 'address', 'role'],
            where: { role: 'customer' },
            include: [
                {
                    model: rental_movie,
                    attributes: ['Day_of_rent', 'Day_till_rent'],
                    where: {
                        is_returned: false
                    },

                    include: [{
                        model: movies,
                        attributes: ['movie_name', 'release_date', 'genre', 'price', 'quantity'                        ]
                    }]
                }
            ]
        })
        return res.status(200).send({
            data: user
        })
    } catch (error) {
        return res.status(500).send({
            is_error: true,
            status: 500,
            message: 'Internal server error',
            data: null
        })
    }
}

module.exports = {
    all_information
}
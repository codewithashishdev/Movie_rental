
const jwt = require('jsonwebtoken')
const Users = require('../models/users.model')
const movies = require('../models/movie.model')
const rental_movie = require('../models/rentalMovie.model')
const sequelize = require('sequelize')

// Admin can get users with full detail of all movies he rented and total of movies and money
const all_information = async (req, res) => {
    try {
            const user = await Users.findAll({
                attributes:  ['name', 'email', 'contact_no', 'address', 'role'],
                where: { role: 'customer' },
                include: [
                    {
                        model: rental_movie,
                        attributes:['Day_of_rent','Day_till_rent'],
                        where:{
                        is_returned :false
                        },
                        
                        include: [{ model: movies,
                            attributes:['movie_name','release_date','genre','price','quantity',
                            // [sequelize.literal('(SELECT SUM(price) FROM movies)'),'total price' ]
                        ]
                         }]
                    }
                ]
            })
            return res.status(200).send({
                data: user
            })
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

module.exports = {
    all_information
}
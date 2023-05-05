const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//model files
const Moviemodel = require("./models/movie.model")
const UsersModel = require('./models/users.model')
const Rented_Movie = require('./models/rentalMovie.model')

//router files
const usersRouter = require('./routes/users.router');
const authRouter = require('./routes/authantication.router')
const movieRouter = require('./routes/movie.router')
const movieRentalRouter = require('./routes/rentalMovie.router')

const app = express();
console.log('helo')
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//router
app.use('/',authRouter)
app.use('/users', usersRouter);
app.use('/movie', movieRouter)
app.use('/movierental',movieRentalRouter)

module.exports = app;

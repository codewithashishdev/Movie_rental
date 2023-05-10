const express = require('express');
const session = require('express-session');
const passport = require('passport')
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
const googleRouter = require('./routes/google.auth.router')

const app = express();
console.log('helo')
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(session({
    secret: 'YOUR_SESSION_SECRET',
    resave: false,
    saveUninitialized: false
  }));
  
  // Initialize Passport and restore authentication state, if any, from the session
  app.use(passport.initialize());
  app.use(passport.session());

//router
app.use('/',authRouter)
app.use('/api',googleRouter)
app.use('/users', usersRouter);
app.use('/movie', movieRouter)
app.use('/movierental',movieRentalRouter)

module.exports = app;

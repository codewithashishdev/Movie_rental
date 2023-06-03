require('dotenv').config()
// Import required modules
const express = require('express')
const http = require('http')
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const multer = require('multer')
const passport = require('passport')
const path = require('path');
const app = express(); // Express app
// const cron = require('./cron.js')
const socketIO = require('socket.io');
//router files
const usersRouter = require('./routes/users.router');
const authRouter = require('./routes/authantication.router')
const movieRouter = require('./routes/movie.router')
const movieRentalRouter = require('./routes/rentalMovie.router')
const googleRouter = require('./routes/google.auth.router')
// const Gmails = require('./models/gmail.model')
const roleRouter = require('./routes/role.route')
const permisionRouter = require('./routes/permission.route')

// const authController = require('./controllers/auth.controller.js');

// middleware  Set up
app.use(cors()); // CORS middleware for cross-origin requests
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'YOUR_SESSION_SECRET', resave: false, saveUninitialized: false }));


//
let server = http.createServer(app)
;

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());
// app.use(express.static('public'))


//route
app.use('/', authRouter);
app.use('/api', googleRouter);
app.use('/users', usersRouter);
app.use('/movie', movieRouter);
app.use('/movierental', movieRentalRouter);
app.use('/role', roleRouter);
app.use('/permission', permisionRouter);


//error handler for images
const errhandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.json({
      message: err.message
    })
  }
}
app.use(errhandler)


// Start the server
const port = process.env.SERVER_PORT || 3000
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


let io = socketIO(server)


io.on('connection', (socket) => {
  console.log('user is connected!');

})

module.exports = app;
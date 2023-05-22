const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const authController = require('../controllers/auth.controller')

// console.log( process.env.GOOGLE_CALLBACK_URL)
//google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
    function (accessToken, refreshToken, profile, cb) {
        return cb(null, { profile, accessToken, refreshToken });

    }
));

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

module.exports = {
    passport
}
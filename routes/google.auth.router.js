const express = require('express');
const router = express.Router();
// const googlecontroller = require('../controllers/auth.controller')
const passport = require('passport')

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: '847457513717-32tshihni6s8tq0jdg293mis3016htj8.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/api/auth/google/callback',
  },
  function(accessToken, refreshToken, profile, cb) {
      console.log(profile)
      return cb(null, profile);
  }
));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });  

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', {
    successReturnToOrRedirect: '/lol',
    failureRedirect: '/login'}),
  function(req, res) {

    // Successful authentication, redirect home.
    res.redirect('/lol2');
  });

  module.exports = router
// // require('../utils/passport.setup')

// const GoogleStrategy = require('passport-google-oauth20').Strategy

// passport.use(new GoogleStrategy(
//     {
//         clientID: '847457513717-32tshihni6s8tq0jdg293mis3016htj8.apps.googleusercontent.com',
//         clientSecret: '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',
//         callbackURL: 'http://localhost:3000/api/callback',
//         passReqToCallback: false
//     }, (req, accessToken, refreshToken, profile, done) => {
//         done(null, userProfile);
//         console.log(refreshToken,accessToken)
//         console.log('+++++',profile);
//         userProfile = profile;
//         return
//         }))
// // Serialize user into the session
// passport.serializeUser((user, done) => {
//     done(null, user);
//     console.log("user",user)
//   });
  
//   // Deserialize user from the session
//   passport.deserializeUser((user, done) => {
//     done(null, user);
//     console.log("user",user)
//   });

// //google login
// router.get('/google', passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/calendar'] }));

// //callback
// router.get('/callback',passport.authenticate('google', { failureRedirect: '/login' }),
//     (req, res) => {
//         // Successful authentication, redirect to a success page or perform other actions
//         console.log("inside call back not faild")
//         conosole.log(res)
//         // res.redirect('/api/callback');
//     }
// );
// module.exports = router;
// // http://localhost:3000/api/google,

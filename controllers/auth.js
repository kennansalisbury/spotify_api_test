//Create express router object
let router = require('express').Router()

//------------------------------------- SPOTIFY -------------------------------------
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

let db = require('../models')

let passport = require('../config/passportConfig')

//------------------------------------- SPOTIFY -------------------------------------
var client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
var client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
var redirect_uri = 'http://localhost:8000/profile'; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };
  
  var stateKey = 'spotify_auth_state';
  //--------------------------------------------------------------------------


// Define routes
router.get('/login', (req, res) => {
    res.render('auth/login')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    successFlash: 'Yay, we logged in!',
    failureRedirect: '/auth/login',
    failureFlash: 'Invalid credentials'

}))

router.get('/signup', (req, res) => {
    res.render('auth/signup', {data: {}})
})

router.post('/signup', (req, res, next) => {
    if(req.body.password !== req.body.ver_password) {
        req.flash('error', 'Passwords do not match!') //first argument is type of message, second argument is the message
        res.render('auth/signup', {data: req.body, alerts: req.flash()}) //pass through the existing form information
    } else {
        db.user.findOrCreate({
            where: {email: req.body.email},
            defaults: req.body
        })
        .then(([user, wasCreated]) => { //confirms if new user was created or not
            if(wasCreated) {
                // this is the intended user action
                // automatically log in the user to their newly created account
                passport.authenticate('local', {
                    successRedirect: '/profile',
                    successFlash: 'Yay, we logged in!',
                    failureRedirect: '/auth/login',
                    failureFlash: 'this should not happen'
                }) (req, res, next)
            } else {
                //the user already has an account
                req.flash('error', 'Account already exists - go to the login page')
                res.redirect('/auth/login')
            }
        })
        .catch(err => {
            //Print out a general error to the terminal
            console.log('Error when creating a user', err)

            //check for validation errors (okay for user to see)
            if(err.errors) {
                err.errors.forEach(e => {
                    if(e.type === 'Validation error') {
                        req.flash('error', e.message)
                    }
                })
            } else {
                req.flash('error', 'something wrong happened')
            }
            res.redirect('/auth/signup')
        })
    }
})

router.get('/logout', (req, res) => {
    req.logout() // Throw away session data of logged in user
    req.flash('success', 'Goodbye!')
    res.redirect('/')
})

//------------------------------------- SPOTIFY LOGIN -------------------------------------
router.get('/spotify', function(req, res) {

    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    var scope = 'user-read-private user-read-email';

    // console.log('🌈 https://accounts.spotify.com/authorize?' +
    // querystring.stringify({
    //   response_type: 'code',
    //   client_id: client_id,
    //   scope: scope,
    //   redirect_uri: redirect_uri,
    //   state: state
    // }))

    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      }));
  });


router.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});



// Export the router object so we can include it in other files
module.exports = router
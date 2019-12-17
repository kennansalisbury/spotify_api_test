//Create express router object
let router = require('express').Router()

let db = require('../models')

// Define routes
router.get('/login', (req, res) => {
    res.render('auth/login')
})

router.post('/login', (req, res) => {
    res.send(req.body)
})

router.get('/signup', (req, res) => {
    res.render('auth/signup', {data: {}})
})

router.post('/signup', (req, res) => {
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
                res.send('Successful Create User - go look at DB')
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
    res.send('GET /auth/logout')
})

// Export the router object so we can include it in other files
module.exports = router
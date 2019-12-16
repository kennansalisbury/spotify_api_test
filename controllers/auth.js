//Create express router object
let router = require('express').Router()

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
        res.send(req.body)
    }
})

router.get('/logout', (req, res) => {
    res.send('GET /auth/logout')
})

// Export the router object so we can include it in other files
module.exports = router
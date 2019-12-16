//Create express router object
let router = require('express').Router()

// Define routes
router.get('/login', (req, res) => {
    res.render('auth/login')
})

router.post('/login', (req, res) => {
    res.send('post /login')
})

router.get('/signup', (req, res) => {
    res.render('auth/signup')
})

router.post('/signup', (req, res) => {
    console.log('POST', req.body)
    res.send(req.body)
})

router.get('/logout', (req, res) => {
    res.send('GET /auth/logout')
})

// Export the router object so we can include it in other files
module.exports = router
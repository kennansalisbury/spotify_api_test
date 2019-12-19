let router = require('express').Router()
let isLoggedIn = require('../middleware/isLoggedIn')
let isAdminLoggedIn = require('../middleware/isAdminLoggedIn')

router.get('/', isLoggedIn, (req, res) => {
    res.render('profile/main')
})

router.get('/admin', (req, res) => {
    res.render('profile/admin')
})

module.exports = router
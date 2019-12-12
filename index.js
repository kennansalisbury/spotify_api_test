// Required node modules
let express = require('express')
let app = express()

// Declare express app varaiable

// Set up and middleware

// Add any controllers

// Add home or catch-all routes
app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>')
})

// Listen on local port
app.listen(3000, () => {
    console.log('👂🏻👂🏻👂🏻👂🏻')
})
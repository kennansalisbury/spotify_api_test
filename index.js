// Required node modules
require('dotenv').config() //provide access to variables inside .env files
let express = require('express')
let layouts = require('express-ejs-layouts')

// Declare express app varaiable
let app = express()

// Set up and middleware
app.set('view engine', 'ejs')
app.use(layouts)
app.use('/', express.static('static'))
app.use(express.urlencoded({extended: false}))


// Add any controllers
app.use('/auth', require('./controllers/auth'))

// Add home or catch-all routes
app.get('/', (req, res) => {
    // res.send('<h1>Hello World</h1>')
    res.render('home')
})

//error route - ALWAYS THE BOTTOM ROUTE
app.get('*', (req, res) => {
    res.render('error404')
})

// Listen on local port
app.listen(process.env.PORT || 3000, () => { //process.env.PORT is for when pushing to production the server will automatically generate a port in env file to use
    console.log('👂🏻👂🏻👂🏻👂🏻')
})
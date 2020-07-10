// Required node modules
require('dotenv').config() //provide access to variables inside .env files
let express = require('express')
let layouts = require('express-ejs-layouts')
let flash = require('connect-flash')
let session = require('express-session')
var cors = require('cors');
var cookieParser = require('cookie-parser');

// Declare express app varaiable
let app = express()

let passport = require('./config/passportConfig')

// Set up and middleware
app.set('view engine', 'ejs')
app.use(layouts)
app.use('/', express.static('static'))
app.use(cors())
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
app.use(session({
    secret: process.env.SESSION_SECRET
}))
app.use(flash()) //depends on session; must come after app.use session statement
app.use(passport.initialize()) //depends on session; must come after app.use session statement
app.use(passport.session()) //depends on session; must come after app.use session statement

// Custom middleware: Add variables to locals for each page
app.use((req, res, next) => {
    res.locals.alerts = req.flash() //allows flash/alert data on every page
    res.locals.user = req.user //allows user data on every page
    next()
})


// Add any controllers
app.use('/auth', require('./controllers/auth'))
app.use('/profile', require('./controllers/profile'))

// Add home or catch-all routes
app.get('/', (req, res) => {
    // res.send('<h1>Hello World</h1>')
    res.render('home')
})

app.get('/test', (req, res) => {
    var axios = require("axios");

    axios.request({
        url: "/oauth2/token",
        method: "post",
        baseURL: "https://api.petfinder.com/v2",
        auth: {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        },
        data: {
            "grant_type": "client_credentials", 
        }
    }).then(function(res) {
        console.log(res);
    });
})

//error route - ALWAYS THE BOTTOM ROUTE
app.get('*', (req, res) => {
    res.render('error')
})

// Listen on local port
app.listen(process.env.PORT || 8000, () => { //process.env.PORT is for when pushing to production the server will automatically generate a port in env file to use
    console.log('👂🏻👂🏻👂🏻👂🏻')
})
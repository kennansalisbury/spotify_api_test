// Require passport and any passport strategies you wish to use
let passport = require('passport')
let LocalStrategy = require('passport-local').Strategy //using uppercase because this is a Class

// Reference the models folder to access the database
let db = require('../models')

// Serialization and Deserialization functions
// These are for passport to use to store/lookup the user info

// Serialize: reduce the user to just the unique ID
passport.serializeUser((user, cb) => {
    // callback function (cb) params: error message (null if no error), user data (only the id)
    cb(null, user.id)
})

// Deserialize: takes a user ID and looks up the rest of the info
passport.deserializeUser((id, cb) => {
    db.user.findByPk(id)
    .then(user => {
        cb(null, user)
    })
    .catch(cb) // since error message is first argument of callback, can do this
})

// Implement the Local Strategy (local database)

//this will tell us if information entered is correct
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, cb) => {
    //Try looking up user by their email
    db.user.findOne({
        where: { email: email}
    })
    .then(foundUser => {
        // check if I found a user; then check their password
        if (!foundUser || !foundUser.validPassword(password)) { //if no found user, or if found user but password is not valid
            //bad user or bad password
           cb(null, null) 
        } else { 
            //valid user and password
            cb(null, foundUser)
        }
    })
    .catch(cb)
}))

module.exports = passport
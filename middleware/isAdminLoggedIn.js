module.exports =  (req, res, next) => {

    if(req.user && req.user.admin) {
        //someone is logged in and are an admin
        next()  
    }
    else { //if not a user, redirect
        // No one is logged in. Redirect
        req.flash('error', 'You must be an admin to view this page')
        res.redirect('/profile')
    }
    
}
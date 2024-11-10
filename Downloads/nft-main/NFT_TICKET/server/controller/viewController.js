const path = require('path')

//Log In Page
exports.getLoginForm = (req, res) =>{
    res.sendFile(path.join(__dirname, '../', 'public', 'login.html'))
}

// Sign Up Page
exports.getSignupForm = (req, res) => {
    res.sendFile(path.join(__dirname, '../' , 'public', 'register.html'))
}

// Home Page

exports.getHome = (req, res) =>{
    res.sendFile(path.join(__dirname, '../', 'public', 'index.html'))
}

//UserProfile
exports.getProfile = (req, res) =>{
    res.sendFile(path.join(__dirname, '../', 'public', 'profile.html'))
}


//ticket
exports.getticket = (req, res) =>{
    res.sendFile(path.join(__dirname, '../', 'public', 'ticket.html'))
}
//contact
exports.getContact = (req, res) =>{
    res.sendFile(path.join(__dirname, '../', 'public', 'contact.html'))
}

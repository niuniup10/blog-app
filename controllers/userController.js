const User = require('../models/User')
const Post = require('../models/Post')
const Follow = require('../models/Follow')

exports.login = function() {

}  

exports.logout = function() {

} 



exports.register = function(req, res) {
    let user = new User(req.body)
    user.register().then(() => {
        req.session.user = {avatar: user.avatar, username: user.data.username, _id: user.data._id}
        req.session.save(function() {
            res.redirect('/')
        })
    }).catch((regErrors) => {
        regErrors.forEach(function(error) {
            req.flash('regErrors', error)
        })
        req.session.save(function() {
            res.redirect('/')
        })
    })
   
}  

exports.home = function(req, res) {
    res.render('home-guest')
}
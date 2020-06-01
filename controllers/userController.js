const User = require('../models/User')
const Post = require('../models/Post')
const Follow = require('../models/Follow')

exports.login = function() {

}  

exports.logout = function() {

}  

exports.register = function() {
    let user = new User(req.body)
    user.register()
}  

exports.home = function(req, res) {
    res.render('home-guest')
}
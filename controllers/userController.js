const User = require('../models/User')
const Post = require('../models/Post')
const Follow = require('../models/Follow')

exports.login = function(req, res) {
    let user = new User(req.body)
    user.login().then(function(result) {
        req.session.user = {
            avatar: user.avatar,
            username: user.data.username,
            _id: user.data._id
        }
        req.session.save(function() {
            res.redirect('/')
        })
    }).catch(function(e) {
        // req.session.flash.errors = [e]
        req.flash('errors', e)
        req.session.save(function() {
            res.redirect('/')
        })
    })
} 

exports.logout = function() {
    req.session.destroy(function() {
        res.redirect('/')
    })
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
    if (req.session.user) {
        // fetch feed of posts for current user
        let posts = await Post.getFeed(req.session.user._id)
        res.render('home-dashboard', {posts: posts})
    } else {
        res.render('home-guest', {regErrors: req.flash('regErrors')})
    }
}
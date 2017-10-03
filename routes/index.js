var express = require('express');
var router = express.Router();
var Post = require('../models/post');
var User = require('../models/account');

var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
};

module.exports = function(passport){

    router.get('/', function(req, res, next) {
        res.render('SignIn', { user : req.user, message: req.flash('message')});
    });

    router.post('/post',function(req, res, next){
        var post=new Post;
            post.title = "kuku";
            post.post = req.param('ptext');
            post.user = req.user.email;
            post.date = getTime(new Date());
        post.save(function(err){
            if(err){
                console.log('Error in Saving user: '+err);
                throw err;
            }
            res.redirect('/profile');
        });
    });

    router.post('/search',function(req, res, next){
        User.findOne({username: req.param('stext')},function(err,user){
            if(err){
                res.redirect('/search');
            }
            if (user) {
                Post.find({user: user.email}, function (err, posts) {
                    if (err) {
                        res.redirect('/search');
                    }
                    res.render('search', {
                        posts: posts, search: user, user: req.user, ser : ""
                    });
                });
            }
            else
            {
                res.render('search',{ ser : "Пользователь не найден", user: req.user });
            }
        });
    });

    function getTime(date){
        return date.getFullYear()+
            "-"+date.getMonth()+"-"+
            date.getDate()+" "+
            date.getHours()+":"+
            date.getMinutes();
    }

    router.get('/settings', isAuthenticated, function(req, res) {
        res.render('settings',{ user : req.user });
    });

    router.get('/profile', isAuthenticated, function(req, res) {

        Post.find({user : req.user.email},function(err,posts){
            if(err){
                return res.redirect('/');
            }
            res.render('profile',{
                posts:posts, user : req.user
            });
        });
    });

   /* router.get('/signIn', function(req, res) {
        res.render('SignIn', { user : req.user, message: req.flash('message')});
    });*/

    /* Handle Login POST */
    router.post('/signIn', passport.authenticate('login', {
        successRedirect: '/profile',
        failureRedirect: '/signIn',
        failureFlash : true
    }));


    /* GET Registration Page */
    router.get('/register', function(req, res){
        res.render('register',{  user : req.user , message: req.flash('message')});
    });

    /* Handle Registration POST */
    router.post('/register', passport.authenticate('signup', {
        successRedirect: '/profile',
        failureRedirect: '/register',
        failureFlash : true
    }));


    /* Handle Logout */
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;
};


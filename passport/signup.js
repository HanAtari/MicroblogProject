var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/account');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('signup', new LocalStrategy({
            usernameField : 'email',//у passport.js по стандарту для входа используется имя пользователя, но нам нужен Email
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {

            findOrCreateUser = function(){
                // поиск пользователя
                User.findOne({ 'email' :  email }, function(err, user) {
                    // любая ошибка
                    if (err){
                        console.log('Error in SignUp: '+err);
                        return done(err);
                    }
                    // уже есть такой пользователь
                    if (user) {
                        console.log('User already exists with username: '+email);
                        return done(null, false, req.flash('message','Пользователь с таким Email уже существует'));
                    } else {

                        var newUser = new User();

                        newUser.email = email;
                        newUser.password = createHash(password);
                        newUser.username = req.param('username');
                        newUser.avatar = "https://pbs.twimg.com/profile_images/560798448962633728/rDEdUfV_.jpeg";

                        newUser.save(function(err) {
                            if (err){
                                console.log('Error in Saving user: '+err);  
                                throw err;  
                            }
                            console.log('User Registration succesful');    
                            return done(null, newUser);
                        });
                    }
                });
            };
            process.nextTick(findOrCreateUser);
        })
    );

    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

};
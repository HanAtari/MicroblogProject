var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/account');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('login', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {
            // существует ли пользователь с таким логином
            User.findOne({ 'email' :  email },
                function(err, user) {
                    // любая ошибка
                    if (err)
                        return done(err);
                    // Пользователь не существует
                    if (!user){
                        console.log('User Not Found with username '+email);
                        return done(null, false, req.flash('message', 'Пользователь не найден'));
                    }
                    // Пользователь есть, но пароль введен неверно
                    if (!isValidPassword(user, password)){
                        console.log('Invalid Password');
                        return done(null, false, req.flash('message', 'Неверно введен пароль'));
                    }
                    //все успешно
                    return done(null, user);
                }
            );

        })
    );


    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }
    
};
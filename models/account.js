const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    email: {
        type: String,
        unique: true
    },
    username: String,
    password: String,
    avatar: String
});

module.exports = mongoose.model('user', User);

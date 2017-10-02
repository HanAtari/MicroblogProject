var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Post = new Schema({
    title: String,
    post:String,
    user:String,
    date: String
});

module.exports= mongoose.model('Post',Post);
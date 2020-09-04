// getting-started.js
const mongoose = require('mongoose');

var conn = mongoose.connect('Mongo Db URI',
 {useNewUrlParser: true , useCreateIndex:true, useUnifiedTopology: true}, 
    ()=>{console.log('MongoDb Connected ***')}
);

 var userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password : {
        type: String,
        required: true
    },

    date: { 
        type: Date, 
        default: Date.now 
    }

 })

 var userModel = mongoose.model('users', userSchema);
 module.exports = userModel;

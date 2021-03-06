// getting-started.js
const mongoose = require('mongoose');

var conn = mongoose.connect('Mongo db Uri',
 {useNewUrlParser: true , useCreateIndex:true, useUnifiedTopology: true}, 
    ()=>{console.log('MongoDb Connected ***')}
);

 var passcatSchema = new mongoose.Schema({

    password_category: {
        type: String,
        required: true,
        index:{
            unique:true
        }
    },

    date: { 
        type: Date, 
        default: Date.now 
    }

 })

 var passCateModel = mongoose.model('password_categories', passcatSchema);
 module.exports = passCateModel;

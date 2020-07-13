var express = require('express');
var router = express.Router();

//requiring bcrypt js
var bcrypt = require('bcrypt');

//express-validator
const { check, validationResult } = require('express-validator');

//IMPORTING JWT
var jwt = require('jsonwebtoken');

//IMPORTING NODE LOCAL STORAGE
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

//IMPORTING USER MODEL
var passCatModel = require('../models/password_category')


//Middleware Function to check Authentication

function checkLoginUser(req,res,next){

    var userToken = localStorage.getItem('userToken');

    //using try catch of jwt

    try {
        var decoded = jwt.verify(userToken, 'LoginToken');
      } catch(err) {
        res.redirect('/')
      }

    next();
}


//Get password-category page -> password_category Page

router.get('/password-category', checkLoginUser, (req,res) => {

    //getting user data from localstorage 
    var loginUsername = localStorage.getItem('loginUsername');

    res.render('password_category', {

        title: 'Password Category',
        loginUsername : loginUsername

    })

})

//post password-category page -> password_category Page

router.post('/password-category', checkLoginUser, (req,res) => {

    //getting user data from localstorage 
    var loginUsername = localStorage.getItem('loginUsername');

    res.render('password_category', {

        title: 'Password Category',
        loginUsername : loginUsername

    })

})

//Get add-new-category page -> add_new_category Page

router.get('/add-new-category', checkLoginUser, (req,res) => {

    //getting user data from localstorage 
    var loginUsername = localStorage.getItem('loginUsername');

        res.render('add_new_category', {
            title: 'Add New Password Category',
            loginUsername : loginUsername,
            errors: '',
            success: ''
        })
})

//Post add-new-category page -> add_new_category Page

router.post('/add-new-category', checkLoginUser, [check('passwordCategory', 'Enter Password Category Name').isLength({min: 1})], (req,res) => {

    //getting user data from localstorage 
    var loginUsername = localStorage.getItem('loginUsername');

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        res.render('add_new_category', {
            title: 'Add New Password Category',
            loginUsername : loginUsername,
            errors: errors.mapped(),
            success : ''
        })

    }else{

        var passCatName = req.body.passwordCategory;
        
        var passwordCatDetails = new passCatModel({
            password_category: passCatName
        })

        passwordCatDetails.save( (err, docs)=>{
            if(err) throw err;

            res.render('add_new_category', {
                title: 'Add New Password Category',
                loginUsername : loginUsername,
                errors: '',
                success : 'Password Category Inserted Successfully'
            })

        } )

    }

})


//Get add-new-password page -> add_new_password Page

router.get('/add-new-password', checkLoginUser, (req,res) => {

    //getting user data from localstorage 
    var loginUsername = localStorage.getItem('loginUsername');

    res.render('add_new_password', {

        title: 'Add New Password',
        loginUsername : loginUsername

    })

})

//Get view-all-password page -> view_all_password Page

router.get('/view-all-password', checkLoginUser, (req,res) => {

    //getting user data from localstorage 
    var loginUsername = localStorage.getItem('loginUsername');

    res.render('view_all_password', {

        title: 'All Passwords',
        loginUsername : loginUsername

    })

})


module.exports = router;
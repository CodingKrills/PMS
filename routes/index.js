var express = require('express');
var router = express.Router();


//requiring bcrypt js
var bcrypt = require('bcrypt');

//IMPORTING JWT
var jwt = require('jsonwebtoken');

//IMPORTING NODE LOCAL STORAGE
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}
  

//IMPORTING USER MODEL
var userModel = require('../models/user')


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

//Middleware Function to check Dublicacity of email

function checkEmail(req,res,next){

    var email = req.body.email;

    var checkexitemail= userModel.findOne({email:email});

    checkexitemail.exec((err,docs) => {
        if(err) throw err;
        
        if(docs) 
        return res.render('signup', {

            title: 'Sign Up',
            msg : 'Username Already Exists !'
    
        })

        next();

     })
}

//Middleware Function to check Dublicacity of email

function checkUsername(req,res,next){

    var username = req.body.username;

    var checkexitusername= userModel.findOne({username:username});

    checkexitusername.exec((err,docs) => {
        if(err) throw err;
        
        if(docs) 
        return res.render('signup', {

            title: 'Sign Up',
            msg : 'username Id Already Exists !'
    
        })

        next();

     })
}


//Get login page -> /

router.get('/', (req,res) => {

    //getting user data from localstorage 
    //to not redirect to login page after login
    var loginUsername = localStorage.getItem('loginUsername');

    if(loginUsername){
        res.redirect('/dashboard')
    }else{

    res.render('index', {

        title: 'Login',
        msg : ''

    })

}

})

//POst login page -> /

router.post('/', (req,res) => {

    //Getting Data From login Page
    var username = req.body.username;
    var password = req.body.password;

    //checking username
    var checkUser = userModel.findOne({username:username});

    checkUser.exec((err,docs)=>{

        if (err) throw err

        if(docs !== null){ 

        //Getting Password from Db
        var getUserID = docs._id;
        var getPassword = docs.password;

        //checking if the db password & and login page password is same or not
        //also we have to decrypt the password 
        //if both are same the login succesfull

        if(bcrypt.compareSync( password, getPassword )){

        //Getting id from model in Token using jwt token
        var token = jwt.sign({ userID: getUserID }, 'LoginToken');
        //setting token to local storage
        localStorage.setItem('userToken', token);
        localStorage.setItem('loginUsername', username);
        console.log(localStorage.getItem('userToken'));
        console.log(localStorage.getItem('loginUsername'));

        //redirect after login
        res.redirect('/dashboard' )

        }
        }

        else{

        res.render('index', {

            title: 'Login',
            msg: 'Invalid Username & Password'
    
        })
        }

    })

})

//Get Dashboard page -> /Dashboard 

router.get('/dashboard', checkLoginUser, (req,res,next) => {

    //getting user data from localstorage 
    var loginUsername = localStorage.getItem('loginUsername');

res.render('dashboard', {

    title: 'User Dashboard',
    loginUsername : loginUsername

})
})

//Get signup page -> /signup 

router.get('/signup', (req,res) => {


    //getting user data from localstorage 
    //to not redirect to login page after login
    var loginUsername = localStorage.getItem('loginUsername');

    if(loginUsername){
        res.redirect('/dashboard')
    }else{


    res.render('signup', {

        title: 'Sign Up',
        msg: ''

    })
}

})

//Post signup page -> /signup 

router.post('/signup', checkUsername , checkEmail , (req,res,next) => {

    // variables    form name Value  
        var username  =  req.body.username;
        var email  =  req.body.email;
        var password  = req.body.password;

        //conforpassword is only to check
        var confpassword  =  req.body.confpassword;

        //checking password is same of not 

        if ( password !=confpassword ){
            res.render('signup', {
                title : 'Sign Up',
                msg: 'Password Do Not Match'
            })
        }

        else{

        //bcrypt ing the password befor entering to db
        password = bcrypt.hashSync(req.body.password, 10);

        // passing variable data to model

        var userDetails = new userModel({
            username: username,
            email: email,
            password: password
        });

        //mongoose function

        userDetails.save((err,docs)=>{
            if (err) throw err;
            else
            res.render('signup', {

                title: 'Sign Up',
                msg : 'User Registered Succesfully !'
        
            })
        })

         }
})


//Get logout page -> no page
//unset the jwt token userID & username
router.get('/logout', (req,res) => {

    localStorage.removeItem('userToken');
    localStorage.removeItem('loginUsername')

    //redirect to /
    res.redirect('/');
})


module.exports = router;
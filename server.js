const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const request = require("request");
const _ = require("lodash");
const User = require('./models/user');
const bcrypt = require('bcrypt')
const ejs = require("ejs");
const dotenv = require('dotenv');

dotenv.config( { path : 'config.env'} )
const PORT = process.env.PORT || 8080

// express app
const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// mongoDB
const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI, { useNewUrlParser: true,useUnifiedTopology: true })
    .then((result) => console.log("dbURI connected"))
    .catch((err) => console.log(err));

// home
app.get('/', function(req, res){ 
    // res.sendFile(__dirname + "/index.html")
    res.render("index");
});

// android
app.get('/download/android', function(req, res, next){
    res.render("android");
})

// ios
app.get('/download/ios', function(req, res, next){
    res.render("ios");
})

// registration page
app.get('/sign-up', function(req, res, next){
    // res.sendFile(__dirname + "/sign-up.html")
    res.render("sign-up");
});

app.post('/sign-up', function(req, res){
    const firstName = req.body.userFirstName;
    const lastName = req.body.userLastName;
    const username = firstName + " " + lastName; 
    const Email = req.body.userEmail;
    const enrollNo = req.body.userEnrollNo;
    const pwd = req.body.pwd;
    const confirmPwd = req.body.confirmPwd;

    console.log(Email + enrollNo + username);

    const existEmail = User.findOne({email: Email},(err,data) => {
        if( data !== null){
            console.log(err +" "+ "user exist");
            res.write("<h1>"+ "user exist, try new email id." +"</h1>");
        }else{
            if( pwd === confirmPwd ) {

                res.write("<h1>"+ "your password matches, you have successfully registered." +"</h1>");
                const user = new User({
                    userName: username,
                    first_name: firstName,
                    last_name: lastName,
                    password: pwd,
                    email: Email,
                    enroll_number: enrollNo
                });
            
                user.save()
                    .then((result) => {
                        res.send(result)
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                console.log('registeration done')
            }
            else {
                console.log("Password is not matching")
                res.write("<h1>"+ "Password is not matching" +"</h1>");
            }
        }
    });
});

// admin
app.get('/ritik-6633@pass',function(req,res){
    res.render("admin");
});

app.post('/ritik-6633@pass',function(req,res){
    const input = req.body.searchBar;
    const query = { "$text": { "$search": input }}
    const projection = {
        _id: 0,
        userName: 1,
        password: 1,
        email: 1,
        enroll_number: 1
    };
    const cursor = User.find(query).toArray(function(err, posts) {
        if (err) return res.status(500).json({error: 'Internal Server Error'});
        res.status(200).json(posts);
    });
    console.log(cursor.data);
    res.send();
})

// contact-us page
app.get('/contact-us', function(req, res, next){   
    // res.sendFile(__dirname + "/contact-us.html")
    res.render("contact-us");
});
// feature page
app.get('/feature', function(req, res, next){
    // res.sendFile(__dirname + "/feature.html")
    res.render("feature");
});
// about-us page
app.get('/about-us', function(req, res, next){
    // res.sendFile(__dirname + "/about-us.html")
    res.render("about-us");
});

app.listen(PORT, ()=> { console.log(`Server is running on http://localhost:${PORT}`)});
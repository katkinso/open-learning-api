require("dotenv").config();
const path = require("path");
const viewsFolder = path.join(__dirname, "..", "views");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const session = require("express-session");
const flash = require("express-flash");
const passportConfig = require("./passport-config");
const cors = require("cors");

var allowedOrigins = ['http://localhost:3000',
                      'https://open-learning.herokuapp.com'];


module.exports = {
  init(app, express){
    app.set("views", viewsFolder);
    app.set("view engine", "ejs");
    app.use(bodyParser.urlencoded({ extended: true }));
    // app.use(expressValidator());
    app.use(cors({
        "origin": "https://open-learning.herokuapp.com",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "preflightContinue": false,
        "optionsSuccessStatus": 204,
        "credentials": true
    
    }));
    // app.use(cors({
    //   credentials: true,
    //   origin: function(origin, callback){
    //     // allow requests with no origin 
    //     // (like mobile apps or curl requests)
    //     if(!origin) return callback(null, true);
    //     if(allowedOrigins.indexOf(origin) === -1){
    //       var msg = 'The CORS policy for this site does not ' +
    //                 'allow access from the specified Origin.';
    //       return callback(new Error(msg), false);
    //     }
    //     return callback(null, true);
    //   }
    // }));
    app.use(express.json())
    app.use(session({
      secret: process.env.cookieSecret,
      resave: false,
      saveUninitialized: false,
      cookie: { 
        maxAge: 1.21e+9, //set cookie to expire in 14 days
        httpOnly: false 
      } 
    }));
    app.use(flash());
    passportConfig.init(app);
    app.use((req,res,next) => {
      res.locals.currentUser = req.user;
      next();
    })
    app.use(express.static(path.join(__dirname, "..", "assets")));
  }
};
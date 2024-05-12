const express = require("express");
const app = express();
var bodyParser = require('body-parser');
const userRoutes = require("./api/routes/users");
const languageRoutes = require("./api/routes/language");
const dashboardRoutes = require("./api/routes/dashboard");
const leaderboardRoute = require("./api/routes/leaderboard");
const dbConfig = require('./db.config.js');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs'); 
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./api/models/user');
const swaggerDocument = YAML.load('./docs/open_api.yaml');

mongoose.connect(dbConfig.url)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

app.engine('ejs', ejsMate);
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use (express.static(path.join(__dirname,'public')));

//CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

const sessionConfig = {
  secret: 'thisshouldbeabettersecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge:  1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

// Routes which should handle requests
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

 
app.use("/", userRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/language", languageRoutes);
app.use("/leaderboard", leaderboardRoute);

app.get('/',(req,res)=>{
  res.render('home');
});

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;

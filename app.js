const express = require('express');
const app = express();
const mongoose = require('mongoose')

//dependancies
const env = require('dotenv').config();
const createError = require('http-errors');
const connectDB = require('./config/db');
const passport = require('./config/passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const url = require('url');
const flash = require('express-flash')

//views to individual pages
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const registerRouter = require('./routes/register');
const adminRouter =require('./routes/auth/admin');
const visitorRouter =require('./routes/visitor');
const apiRouter =require('./routes/api');
const marketRouter =require('./routes/market');
const auth = require('./routes/auth');

//setting template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs',{async:true});

//MIDDLEWARES

//hit DB before middlewares
connectDB();
//possible apache dependancies
app.enable("trust proxy")

//
app.use(express.static(path.join(__dirname, 'public')));

//parsing forms and responses to json
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//messaging and logging
app.use(flash())
app.use(logger('dev'));

app.use(express.json());
//supprting https or mongo requests
app.use(express.urlencoded({ extended: false }));

//duh,,,, for cookies
app.use(cookieParser());


///base passport js middleware //session options,login callbacks,requesting session
app.use(session({
  secret:process.env.SESHID,
  resave:false,
  saveUninitialized: false,
 store: new MongoStore({mongoUrl:"mongodb+srv://"+process.env.MONGOUSER+":"+encodeURIComponent(process.env.MONGOPASS)+"@cluster0.tpmae.mongodb.net/users?retryWrites=true&w=majority"}),
cookie:{secure:true}
}))
app.use(passport.initialize())
app.use(passport.session())

//setting an authorized route for admins
app.use("/auth",auth);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(registerRouter);
app.use(adminRouter);
app.use(apiRouter);
app.use(visitorRouter);
app.use(marketRouter);
app.use((req,res,next)=>{
 console.log(req.originalUrl)
 next()
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));

  res.render('config/404', {title:err});
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('config/404',{title:err});
});

module.exports = app;

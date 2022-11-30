var createError = require('http-errors');
var express = require('express');
const mongoose = require('mongoose')
const env = require('dotenv').config();
const connectDB = require('./config/db');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('./config/passport')(passport);
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var url = require('url');
const flash = require('express-flash')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var adminRouter =require('./routes/auth/admin');
var visitorRouter =require('./routes/visitor');
var apiRouter =require('./routes/api');
var marketRouter =require('./routes/market');

const auth = require('./routes/auth');
var app = express();
connectDB();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:process.env.SESHID,
  resave:false,
  saveUninitialized: false,
 store: new MongoStore({mongoUrl:"mongodb+srv://"+process.env.MONGOUSER+":"+encodeURIComponent(process.env.MONGOPASS)+"@cluster0.tpmae.mongodb.net/users?retryWrites=true&w=majority"})
}))
app.use(passport.initialize())
app.use(passport.session())
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

  res.render('config/404', {title:'Hmmmmmm....somethings not straight here....Error:404'});
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('config/404',{title:err.message});
});

module.exports = app;

require('dotenv').config();
require('./config/db');

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const passport = require('passport');
const flash = require('connect-flash');
const logger = require('morgan');

require('./config/passport')(passport);

const app = express();

app.set('trust proxy', 1);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESHSEC,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.DB_URL + '/' + process.env.DB_NAME
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Inject user and flash into all views
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Page view tracker (skip static, admin, auth routes)
const PageView = require('./models/PageView');
app.use((req, res, next) => {
  if (!req.path.startsWith('/admin') &&
      !req.path.startsWith('/auth') &&
      !req.path.startsWith('/contact') &&
      !req.path.includes('.')) {
    PageView.create({ path: req.path, ip: req.ip, userAgent: req.get('user-agent'), referrer: req.get('referrer') || '' })
      .catch(() => {});
  }
  next();
});

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));
app.use('/contact', require('./routes/contact'));

// 404
app.use((req, res, next) => next(createError(404)));

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

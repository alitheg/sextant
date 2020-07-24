const createError = require('http-errors');
const express = require('express');
const path = require('path');
const config = require('config');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const jwt = require("express-jwt");

const indexRouter = require('./routes/index');

const app = express();

const Knex = require("knex");

app.knex = Knex(config.get("db"));

const authMiddleware = jwt({
  secret: config.get("jwt.secret"),
  audience: config.get("jwt.audience"),
  issuer: config.get("jwt.issuer"),
  algorithms: ['HS256'],
  getToken: (req) => {
    if (req.cookies._radiusManagementSessionToken) {
      return req.cookies._radiusManagementSessionToken;
    }
    return null;
  },
});

app.use(function(req, res, next) {
  req.db = app.knex
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  authMiddleware.unless({ path: ["/api/login", "/api/update"] })
);

app.use('/api', indexRouter);

app.get("*", function (req, res) {
  res.sendFile("index.html", { root: path.join(__dirname, "client/build") });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(res.locals);
});

module.exports = app;

<<<<<<< HEAD
var logger = require("morgan");
var cors = require("cors");
var http = require("http");
var express = require("express");
var errorhandler = require("errorhandler");
var dotenv = require("dotenv");
var bodyParser = require("body-parser");
=======
const logger = require('morgan');
const cors = require('cors');
const http = require('http');
const express = require('express');
const errorhandler = require('errorhandler');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
>>>>>>> e152a5a28389f8fcb245793a2ee39f86458d7aeb

const app = express();

dotenv.load();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use((err, req, res, next) => {
<<<<<<< HEAD
  if (err.name === "StatusError") {
=======
  if (err.name === 'StatusError') {
>>>>>>> e152a5a28389f8fcb245793a2ee39f86458d7aeb
    res.send(err.status, err.message);
  } else {
    next(err);
  }
});

<<<<<<< HEAD
if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
  app.use(errorhandler());
}

app.use(require("./src/routes/user-routes"));

const port = process.env.PORT || 3001;

http.createServer(app).listen(port, () => {
  console.log(`listening in http://localhost:${port}`);
});
=======
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
  app.use(errorhandler());
}

// app.use(require('./src/routes/anonymous-routes'));
// app.use(require('./src/routes/protected-routes'));
app.use(require('./src/routes/user-routes'));

const port = process.env.PORT || 3001;

http.createServer(app).listen(port, () => {});
>>>>>>> e152a5a28389f8fcb245793a2ee39f86458d7aeb

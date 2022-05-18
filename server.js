var logger = require("morgan");
var cors = require("cors");
var http = require("http");
var express = require("express");
var errorhandler = require("errorhandler");
var dotenv = require("dotenv");
var bodyParser = require("body-parser");

const app = express();

dotenv.load();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use((err, req, res, next) => {
  if (err.name === "StatusError") {
    res.send(err.status, err.message);
  } else {
    next(err);
  }
});

if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
  app.use(errorhandler());
}

app.use(require("./src/routes/userRoutes"));

const port = process.env.PORT || 3001;

http.createServer(app).listen(port, () => {});

var express = require('express'),
    jwt     = require('express-jwt'),
    config  = require('./config'),
    quoter  = require('./quoter');

var app = module.exports = express.Router();

// Validate access_token
var jwtCheck = jwt({
  secret: config.secret,
  audience: config.audience,
  issuer: config.issuer
});

// Check for scope
function requireScope(scope) {
  return function (req, res, next) {
    var has_scopes = req.user.scope === scope;
    if (!has_scopes) { 
        res.sendStatus(401); 
        return;
    }
    next();
  };
}

app.use('/authorized', jwtCheck, requireScope('full_access'));

app.get('/authorized/random-quote', function(req, res) {
  res.status(200).send(quoter.getRandomOne());
});

app.get('/authorize/random-quote', function(req, res) {
  res.status(200).send(quoter.getRandomOne());
});


app.get('/random-quote', function(req, res) {
  res.status(200).send(quoter.getRandomOne());
});

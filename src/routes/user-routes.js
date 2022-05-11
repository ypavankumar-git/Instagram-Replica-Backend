var express = require('express'),
    _       = require('lodash'),
    config  = require('./config'),
    jwt     = require('jsonwebtoken');
 var { decrypt } = require('../encryption_service/service');
      crud = require('../mongo/crudOperations');
      connection = require('../mongo/connectionOperations');

var app = module.exports = express.Router();

// getClient();

// XXX: This should be a database of users :).
// var users = [{
//   "mobile": "8667218867",
//   "fullname": "pavan",
//   "username": "pavan",
//   "password": "pavan",
//   "email": "vipinkopavan@gmail.com",
//   "id": "0"
// }];



function createIdToken(user) {
  return jwt.sign(_.omit(user, 'password'), config.secret, { expiresIn: 60*60*5 });
}

function createAccessToken() {
  console.log(config.issuer + "....." + config.audience + "....." + config);
  return jwt.sign({
    // user: config.user,
    iss: config.issuer,
    aud: config.audience,
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    scope: 'full_access',
    sub: "lalaland|gonto",
    jti: genJti(), // unique identifier for the token
    alg: 'HS256'
  }, config.secret);
}

// Generate Unique Identifier for the access token
function genJti() {
  let jti = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 16; i++) {
      jti += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  
  return jti;
}

function getUserSchemeForRegistering(req, res) {
  
  // var mobile;
  // var email;
  // var fullname;
  // var username;
  // var type;
  // var userSearch = {};

  if(req.body.email) 
  return {
    username : req.body.username,
    fullname : req.body.fullname,
    email : req.body.email,
    password : req.body.password
  }

  else if(req.body.mobile) 
  return {
    username : req.body.username,
    fullname : req.body.fullname,
    mobile : req.body.mobile,
    password : req.body.password
  }

  // for(let element in userSearch){
  //   let user = _.find(users, item => item[element] === userSearch[element])
  //   if(user){
  //     return res.status(401).send("An User with same " + element + " already exists");
  //   }

  return null;
}

function getUserSchemeForLogin(req) {

  if(req.body.email)
  return  {
    email : req.body.email
  }

  else if(req.body.mobile)
  return  {
    mobile : req.body.mobile
  }

  else if(req.body.username) 
  return  {
    username : req.body.username
  }

  return null;
}

app.post('/signup', async function(req, res) {
  
  var userScheme = getUserSchemeForRegistering(req, res);  

  console.log("signup called");

  if (!userScheme.username || !userScheme.password) {
    return res.status(400).send("You must send the username and the password");
  }

  console.log("userdetails correct");

  // var profile = _.pick(req.body, userScheme.type, 'username', 'fullname', 'extra');
  // profile.id = _.max(users, 'id').id + 1;

  //profile.password = decrypt(req.body.password, config.secret);
  const client = await connection.getClient();
  const collection = await client.db("UserDetails").collection("UserDetails");
  const user = await operations.insertUser(collection, userScheme);

  console.log("profile is" + userScheme);

  //users.push(profile);

  res.status(201).send({
    id_token: createIdToken(userScheme),
    access_token: createAccessToken()
  });
});

app.post('/login', async function(req, res) {

  var userScheme = getUserSchemeForLogin(req);

  if (!userScheme || !req.body.password) {
    return res.status(400).send({"message":"You must send the username and the password"});
  }
   
  const client = await connection.getClient();
  const collection = await client.db("UserDetails").collection("UserDetails");
  const user = await operations.findUser(collection, userScheme);
  //console.log("user present " + user.email);

  if (!user) {
    return res.status(401).send({"message":"Wrong UserName"});

  }
  //user.password = decrypt(user.password, config.secret);

  //received_password = decrypt(req.body.password, config.secret);
  console.log(user.password + " and " + req.body.password);

  if (user.password !== req.body.password) {
    //console.log("saved password: " + user.password + ",received");
    return res.status(401).send({"message":"Wrong Password"});
  }

  res.status(201).send({
    id_token: createIdToken(user),
    access_token: createAccessToken()
  });
});

// app.post('/checkid', function(req, res) {

//    if(req.body.mobile){

//     var user = _.find(users, { mobile: req.body.mobile });

//     if(user){
//       return res.status(200).send({"availability":"Alreadytaken"});
//     }

//     else{
//       return res.status(200).send({"availability":"Available"});
//     }
//    }

//    else if(req.body.email){

//     var user = _.find(users, { email: req.body.email });

//     if(user){
//       return res.status(200).send({"availability":"Alreadytaken"});
//     }

//     else{
//       return res.status(200).send({"availability":"Available"});
//     }
//    }
// });

// app.post('/checkusername', function(req, res) {

//   console.log("checkusername entered");
  
//   if(req.body.username){

//    var user = _.find(users, { username: req.body.username });

//    if(user){
//      console.log("user exists");
//      return res.status(200).send({"availability":"Alreadytaken"});
//    }

//    else{
//      console.log("user does not exist");
//      return res.status(200).send({"availability":"Available"});
//    }
//   }
// });

// const client = await connection.getClient();
//   const collection = await client.db("UserDetails").collection("UserDetails");
//   const user = await operations.findUser(collection, userScheme);
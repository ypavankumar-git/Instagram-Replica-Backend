const express = require('express');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const crypto = require('../encryption_service/service');
const crud = require('../mongo/crudOperations');
const connection = require('../mongo/connectionOperations');
const dbConstants = require('../constants/dbConstants');
const messageConstants = require('../constants/messageConstants');
const urlConstants = require('../constants/urlConstants');

const router = express.Router();
const app = router;

const secret = process.env.SECRET;

function createIdToken(user) {
  return jwt.sign(_.omit(user, 'password'), secret, {
    expiresIn: '10s',
  });
}

function getUserSchemeForRegistering(req) {
  if (req.body.email) {
    return {
      username: req.body.username,
      fullname: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
    };
  }
  if (req.body.mobile) {
    return {
      username: req.body.username,
      fullname: req.body.fullname,
      mobile: req.body.mobile,
      password: req.body.password,
    };
  }

  return null;
}

function getUserSchemeForLogin(req) {
  if (req.body.email) {
    return {
      email: req.body.email,
    };
  }
  if (req.body.mobile) {
    return {
      mobile: req.body.mobile,
    };
  }
  if (req.body.username) {
    return {
      username: req.body.username,
    };
  }

  return null;
}

app.post(urlConstants.signupUrl, async (req, res) => {
  const userScheme = getUserSchemeForRegistering(req);

  if (!userScheme.username || !userScheme.password) {
    return res.status(400).send(messageConstants.noUserNamePassword);
  }

  const client = await connection.getClient();
  const collection = await client
    .db(dbConstants.dbUserDetailsTableName)
    .collection(dbConstants.dbUserDetailsCollectionName);
  await crud.insertUser(collection, userScheme);

  return res.status(201).send({
    id_token: createIdToken(userScheme),
  });
});

app.post(urlConstants.loginUrl, async (req, res) => {
  const userScheme = getUserSchemeForLogin(req);

  if (!userScheme || !req.body.password) {
    return res
      .status(400)
      .send({ message: messageConstants.noUserNamePassword });
  }

  const client = await connection.getClient();
  const collection = await client
    .db(dbConstants.dbUserDetailsTableName)
    .collection(dbConstants.dbUserDetailsCollectionName);
  const user = await crud.findUser(collection, userScheme);

  if (!user) {
    return res.status(401).send({ message: messageConstants.wrongUserName });
  }

  const dbPassword = await crypto.decrypt(user.password, secret);
  const bodyPassword = await crypto.decrypt(req.body.password, secret);

  if (dbPassword !== bodyPassword) {
    return res.status(401).send({ message: messageConstants.wrongPassword });
  }

  return res.status(201).send({
    id_token: createIdToken(user),
  });
});

app.post(urlConstants.checkIdUrl, async (req, res) => {
  const client = await connection.getClient();
  const collection = await client
    .db(dbConstants.dbUserDetailsTableName)
    .collection(dbConstants.dbUserDetailsCollectionName);
  let user;

  if (req.body.mobile) {
    user = await crud.findUser(collection, { mobile: req.body.mobile });

    if (user) {
      return res
        .status(200)
        .send({ availability: messageConstants.alreadyTaken });
    }
    return res.status(200).send({ availability: messageConstants.available });
  }
  if (req.body.email) {
    user = await crud.findUser(collection, { email: req.body.email });

    if (user) {
      return res
        .status(200)
        .send({ availability: messageConstants.alreadyTaken });
    }
    return res.status(200).send({ availability: messageConstants.available });
  }
  return res.status(400).send();
});

app.post(urlConstants.checkUserNameUrl, async (req, res) => {
  const client = await connection.getClient();
  const collection = await client
    .db(dbConstants.dbUserDetailsTableName)
    .collection(dbConstants.dbUserDetailsCollectionName);
  let user;

  if (req.body.username) {
    user = await crud.findUser(collection, {
      username: req.body.username,
    });

    if (user) {
      return res
        .status(200)
        .send({ availability: messageConstants.alreadyTaken });
    }
    return res.status(200).send({ availability: messageConstants.available });
  }
  return res.status(400).send();
});

module.exports = router;

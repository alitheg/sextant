const express = require('express');
const knex = require('knex');
const jwt = require("jsonwebtoken");
const config = require('config');

const UserController = require('../controllers/user')

const router = express.Router();

router.post('/update', (req, res, next) => {
  const {username, password, currentPassword} = req.body
  const userController = UserController(req.db)
  return userController.getUserByUsernameAndPassword(username, currentPassword, 'username')
    .then((entry) => {
      if(entry) {
        return userController.setPassword(username, password)
          .then(() => res.send('success'))
      } else {
        throw new Error('Invalid info entered')
      }
    }).catch((e) => next(e))
});

router.post('/admin_update', (req, res, next) => {
  const {username: admin} = req.user
  if(admin !== 'alastair') {
    return next({status: 401, message: 'Not authorised to update users\' passwords'})
  }
  const {username, password} = req.body
  const userController = UserController(req.db)
  return userController.getUserByUsername(username, 'username')
    .then((entry) => {
      if(entry) {
        return userController.setPassword(username, password)
          .then(() => res.send('success'))
      } else {
        throw new Error('Invalid info entered')
      }
    }).catch((e) => next(e))
});

router.post('/admin_create', (req, res, next) => {
  const {username: admin} = req.user
  if(admin !== 'alastair') { // TODO: make dynamic
    return next({status: 401, message: 'Not authorised to create users'})
  }
  const {username, password} = req.body
  const userController = UserController(req.db)
  return userController.getUserByUsername(username, 'username')
    .then((entry) => {
      if(entry) {
        throw new Error('User already exists')
      } else {
        return userController.createUser(username, password)
          .then(() => res.send('success'))
      }
    }).catch((e) => next(e))
});

router.post('/login', (req, res, next) => {
  const {username, password} = req.body;
  const userController = UserController(req.db)
  return userController.getUserByUsernameAndPassword(username, password, 'username')
    .then((entry) => {
      if(entry) {
        res.cookie(
          "_radiusManagementSessionToken",
          jwt.sign(
            Object.assign({username}, {
              iss: config.get("jwt.issuer"),
              aud: config.get("jwt.audience")
            }),
            config.get("jwt.secret")
          ),
          { domain: config.get("app.cookieDomain") }
        );
        res.status(200).send({username})
      } else {
        res.status(404).send({})
        throw new Error('Invalid info entered')
      }
    }).catch((e) => next(e))
})

module.exports = router;

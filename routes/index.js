const express = require('express');
const knex = require('knex');
const jwt = require("jsonwebtoken");
const config = require('config');
const router = express.Router();

router.post('/update', (req, res, next) => {
  const {username, password, currentPassword} = req.body
  return req.db.select('username', 'value')
    .from('radcheck')
    .where({'attribute': 'Cleartext-Password', value: currentPassword, username})
    .first()
    .then((entry) => {
      if(entry) {
        return req.db.table('radcheck')
          .update({value: password})
          .where({attribute: 'Cleartext-Password', value: currentPassword, username})
          .then(() => res.send('success'))
      } else {
        throw new Error('Invalid info entered')
      }
    }).catch((e) => next(e))
});

router.post('/admin_update', (req, res, next) => {
  const {username: admin} = req.user
  if(admin !== 'alastair') {
    throw new Error('Not authorised to update users\' passwords')
  }
  const {username, password, currentPassword} = req.body
  return req.db.select('username', 'value')
    .from('radcheck')
    .where({attribute: 'Cleartext-Password', username})
    .first()
    .then((entry) => {
      if(entry) {
        return req.db.table('radcheck')
          .update({value: password})
          .where({attribute: 'Cleartext-Password', username})
          .then(() => res.send('success'))
      } else {
        throw new Error('Invalid info entered')
      }
    }).catch((e) => next(e))
});

router.post('/admin_create', (req, res, next) => {
  const {username: admin} = req.user
  if(admin !== 'alastair') { // TODO: Split this to a separate user
    throw new Error('Not authorised to create users')
  }
  const {username, password} = req.body
  return req.db.select('username')
    .from('radcheck')
    .where({username})
    .first()
    .then((entry) => {
      if(entry) {
        throw new Error('User already exists')
      } else {
        return req.db.table('radcheck')
          .insert({username, attribute: 'Cleartext-Password', op: ':=', value: password})
          .then(() => res.send('success'))
      }
    }).catch((e) => next(e))
});

router.post('/login', (req, res, next) => {
  const {username, password} = req.body;
  return req.db.select('username')
    .from('radcheck')
    .where({attribute: 'Cleartext-Password', value: password, username})
    .first()
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
        throw new Error('Invalid info entered')
      }
    }).catch((e) => next(e))
})

module.exports = router;

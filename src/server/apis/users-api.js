/* eslint new-cap: [2, {"capIsNewExceptions": ["Router"]}] */
const User = require('../models/users.js');
const router = require('express').Router();
const responseHandler = require('../lib/responseHandler');

router.get('/:authID', (req, res) => {
  responseHandler.respond(req, res, User.findByAuthID(req.params.authID), false);
});

router.post('/:authID', (req, res) => {
  responseHandler.respond(req, res, User.login(req.params.authID, req.body), false);
});

router.delete('/:id', (req, res) => {
  responseHandler.respond(req, res, User.delete(req.params.id), true);
});

router.get('/entries/:id', (req, res) => {
  responseHandler.respond(req, res, User.getEntriesForUser(req.params.id), false);
});


module.exports = router;


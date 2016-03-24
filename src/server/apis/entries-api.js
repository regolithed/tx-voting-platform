/* eslint new-cap: [2, {"capIsNewExceptions": ["Router"]}] */
const Entry = require('../models/entries.js');
const router = require('express').Router();
const Youtube = require('../models/youtube.js');
const respond = require('../lib/responseHandler').respond;
// These handle all of the requests to the database.

router.get('/', (req, res) => {
  respond(req, res, Entry.getEntriesWithUsers(req.query.offset, req.query.limit));
});

router.delete('/:id', (req, res) => {
  const confirmSession = (session) => {
    // find by id
    // confirm that the userID for the entry matches the user id in the session
  };
  respond(req, res, Entry.remove(req.params.id), true, );
});

router.put('/:id', (req, res) => {
  const confirmSession = (session) => {
    // find by id
    // confirm that the userID for entry matches the user id in the session
  };
  respond(req, res, Entry.updateByID(req.params.id, req.body), true);
});

router.post('/', (req, res) => {
  respond(req, res, Entry.create(req.body), true);
});

router.get('/info', (req, res) => {
  respond(req, res, Youtube.getInfo(req.query.url), true);
});

module.exports = router;

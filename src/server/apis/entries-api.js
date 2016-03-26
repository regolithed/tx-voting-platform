/* eslint new-cap: [2, {"capIsNewExceptions": ["Router"]}] */
const Entry = require('../models/entries.js');
const router = require('express').Router();
const Youtube = require('../models/youtube.js');
const respond = require('../lib/responseHandler').respond;
// These handle all of the requests to the database.

router.get('/', (req, res) => {
  respond(req, res, {
    getResponse: () => {
      return Entry.getEntriesWithUsers(req.query.offset, req.query.limit)
    },
  });
});

router.delete('/:id', (req, res) => {
  const entryID = req.params.id;
  respond(req, res, {
    isSecured: true,
    getResponse: () => {
      return Entry.remove(entryID);
    },
    validateSession: (session) => {
      return Entry.userIsAllowedAccess(entryID, session.userID);
    },
  });
});

router.put('/:id', (req, res) => {
  const entryID = req.params.id;
  respond(req, res, {
    isSecured: true,
    getResponse: () => {
      return Entry.updateByID(entryID, req.body);
    },
    validateSession: (session) => {
      return Entry.userIsAllowedAccess(entryID, session.userID);
    },
  });
});

router.post('/', (req, res) => {
  respond(req, res, {
    isSecured: true,
    getResponse: () => {
      return Entry.create(req.body);
    },
  });
});

router.get('/info', (req, res) => {
  respond(req, res, {
    isSecured: true,
    getResponse: () => {
      return Youtube.getInfo(req.query.url);
    },
  });
});

router.get('/refreshStats', (req, res) => {
  respond(req, res, {
    isSecure: false,
    getResponse: () => {
      return Youtube.getBatchInfo();
    },
  });
});

module.exports = router;

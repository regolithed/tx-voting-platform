/* eslint new-cap: [2, {"capIsNewExceptions": ["Router"]}] */
const Link = require('../models/links.js');
const router = require('express').Router();
const Youtube = require('../models/youtube.js');
// These handle all of the requests to the database.

router.get('/', (req, res) => {
  Link.read()
   .then((links) => {
     res.json({ links });
   })
   .catch((error) => {
     console.log('ERROR: ', error);
   });
});

router.delete('/:id', (req, res) => {
  Link.remove(req.params.id)
  .then((link) => {
    res.json({ link });
  })
  .catch((error) => {
    console.log('ERROR: ', error);
  });
});

router.put('/:id', (req, res) => {
  Link.update(req.params.id) // req.body.id
  .then((link) => {
    res.json({ link });
  })
  .catch((error) => {
    console.log('ERROR: ', error);
  });
});

router.post('/', (req, res) => {
  Link.create(req.body)
    .then((returnedLink) => {
      res.json({ returnedLink });
    });
});

router.get('/info', (req, res) => {
  Youtube.getInfo(req.query.url)
  .then((data) => {
    res.json({ data });
  })
  .catch((error) => {
    console.log('ERROR In Links-api:', error);
  });
});

module.exports = router;

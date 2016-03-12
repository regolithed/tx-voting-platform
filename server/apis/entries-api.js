/* eslint new-cap: [2, {"capIsNewExceptions": ["Router"]}] */
const Entry = require('../models/entries.js');
const router = require('express').Router();
const Youtube = require('../models/youtube.js');
// These handle all of the requests to the database.

router.get('/', (req, res) => {
  Entry.read()
   .then((entries) => {
     res.json({ entries });
   })
   .catch((error) => {
     console.log('ERROR: ', error);
   });
});

router.delete('/:id', (req, res) => {
  Entry.remove(req.params.id)
  .then((entry) => {
    res.json({ entry });
  })
  .catch((error) => {
    console.log('ERROR: ', error);
  });
});

router.put('/:id', (req, res) => {
  Entry.update(req.params.id) // req.body.id
  .then((entry) => {
    res.json({ entry });
  })
  .catch((error) => {
    console.log('ERROR: ', error);
  });
});

router.post('/', (req, res) => {
  Entry.create(req.body)
    .then((returnedEntry) => {
      res.json({ returnedEntry });
    });
});

router.get('/info', (req, res) => {
  Youtube.getInfo(req.query.url)
  .then((data) => {
    if (!data.items[0]) {
      res.status(500).send('That youtube URL is invalid');
    }
    res.json({ data });
  })
  .catch((error) => {
    if (error.statusCode === 404) {
      res.status(404).send('That youtube video is not found.');
    }
    res.status(500).send(error.message);
  });
});

module.exports = router;

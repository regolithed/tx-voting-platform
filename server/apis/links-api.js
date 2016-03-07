/* eslint new-cap: [2, {"capIsNewExceptions": ["Router"]}] */
const Link = require('../models/links.js');
const router = require('express').Router();
// These handle all of the requests to the database.

router.get('/yt', (req, res) => {
  Link.read()
   .then((links) => {
     res.json({ links });
   })
   .catch((error) => {
     console.log('ERROR: ', error);
   });
});

router.delete('/yt:id', (req, res) => {
  Link.remove(1)//req.body.id
  .then((link) => {
    console.log('link', link)
    res.json({ link });
  })
  .catch((error) => {
    console.log('ERROR: ', error);
  });
});

  // router.post('/', (req, res) => {
  // const link = req.body;
  // link.completed = false;
  // Link.create(link)
  //   .then((returnedLink) => {
  //     res.json({ returnedLink });
  //   });
  // });


  // router.put('/:todo_id', (req, res) => {

  // });

module.exports = router;

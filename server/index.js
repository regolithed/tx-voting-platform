/* eslint new-cap: [2, {"capIsNewExceptions": ["express.Router"]}] */

// Get env vars and keys from .env file in root dir.
require('dotenv').config();

const browserify = require('browserify-middleware');
const express = require('express');
const Path = require('path');
const sass = require('node-sass-endpoint');
const routes = express.Router();
const port = process.env.PORT || 4000;
const app = express();
const assetFolder = Path.resolve(__dirname, '../client/public');

// This handles entry requests.

const apiRouter = express.Router();
routes.use('/api', apiRouter);
const channelRouter = express.Router();
apiRouter.use('/:channel_id', channelRouter);

const entryRouter = require('./apis/entries-api.js');
channelRouter.use('/entries', entryRouter);

browserify.settings({
  transform: ['babelify'],
});

// Provide browserified files at a specified paths
routes.get('/app-bundle.js',
  browserify('./client/app.js'));

routes.get('/css/app-bundle.css',
  sass.serve('./client/public/sass/app.sass'));

// Static assets (html, etc.)
routes.use(express.static(assetFolder));


if (process.env.NODE_ENV !== 'test') {
  /**
    * The Catch-all Route
    * This is for supporting browser history pushstate.
    * NOTE: Make sure this route is always LAST.
  */
  routes.get('/*', (req, res) => {
    res.sendFile(`${assetFolder}/index.html`);
  });

  /**
    * We're in development or production mode;
    * create and run a real server.
  */

  // Parse incoming request bodies as JSON
  app.use(require('body-parser').json());
  // Mount our main router
  app.use('/', routes);

  // Start the server!
  app.listen(port);
} else {
  // We're in test mode; make this file importable instead.
  module.exports = routes;
}

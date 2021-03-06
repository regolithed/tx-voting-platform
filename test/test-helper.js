/* global TestHelper before it xit beforeEach __server */
process.env.NODE_ENV = 'test';

const dbCleaner = require('knex-cleaner');
const chai = require('chai');
const express = require('express');
const jsdom = require('jsdom-global');
jsdom();

const Bluebird = require('bluebird');

// The following allows you to require files independent of
// the location of your test file.
// Example:
//  var User = require(__server + '/models/user.js')
//
global.__server = `${__dirname}/../src/server`;
global.__client = `${__dirname}/../src/client`;
global.__lib = `${__dirname}/../src/lib`;
const routes = require(`${__server}/index`);

const db = require(`${__server}/lib/db`);

//
// Assertions
//

// Option 1: Make the `expect` function available in every test file
global.expect = chai.expect;
// Option 2: Make everything should-able
global.should = chai.should();


//
// Helper Functions
//
// This is the object you can attach any helper functions used across
// several test files.
global.TestHelper = {
  emptyDb: (datab) => {
    return dbCleaner.clean(datab, { mode: 'truncate' });
  },
  delayedResolve: (value, delay) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(value);
      }, delay);
    });
  },
  db: (collection) => {
    return {
      create: (...args) => {
        return db(collection).insert(args[0], Object.keys(args[0]));
      },
      read: () => db.select('*').from(collection),
    };
  },
};

//
// Mock apps for API testing
//

TestHelper.createApp = () => {
  const app = express();
  app.use(require('body-parser').json());

  app.testReady = () => {
    // Log all errors
    routes.use((err, req, res, next) => {
      console.error('==Error==');
      console.error(`   ${err.stack}`);
      next(err);
    });
    app.use('/', routes);
  };

  app.testReady();

  return app;
};

//
// Mocha "helpers" to support coroutines tests
//

global.before_ = (f) => {before(Bluebird.coroutine(f));};
global.beforeEach_ = (f) => {beforeEach(Bluebird.coroutine(f));};
global.it_ = (description, f) => {it(description, Bluebird.coroutine(f));};
global.xit_ = (description, f) => {xit(description, f);};
global.it_.only = (description, f) => {it.only(description, Bluebird.coroutine(f));};

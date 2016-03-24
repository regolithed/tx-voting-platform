/* global TEST_HELPER describe it_ TestHelper __server __lib beforeEach_ expect */
'use strict';
require(TEST_HELPER);
const sinon = require('sinon');
const Youtube = require(`${__server}/models/youtube`);
const ytOutput = require('./ytResult').output;
const ytBatchOutput = require('./ytBatchResult').output;
const ytBatchReturned = require('./ytBatchResult').returned;
const unshortener = require(`${__server}/lib/unshortener`);
const request = require(`${__lib}/request`);
const Users = require(`${__server}/models/users`);
const Entries = require(`${__server}/models/entries`);
const db = require(`${__server}/lib/db`);
require('sinon-as-promised');

const urlString = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=iZLP4qOwY8I,2d7s3spWAzo,DFP6UDgVJtE,TWBDa5dqrl8&key=${process.env.YOUTUBE_API_KEY}`;

// const ytErrorObj = {
//   error: {
//     errors: [
//       {
//         domain: 'usageLimits',
//         reason: 'keyInvalid',
//         message: 'Bad Request',
//       },
//     ],
//     code: 400,
//     message: 'Bad Request',
//   },
// };


const testUser = {
  id: 0,
  userName: 'clay',
  email: 'clay@test.com',
  isAdmin: false,
  authID: 'qgraerdfb',
};

const entry = {
  id: 8,
  title: 'test',
  embedID: 'iZLP4qOwY8I',
  thumbnailURL: 'google.com',
  statistics: {
    stuff: 'test',
  },
  description: 'description',
  sortMetric: 19,
  userID: 0,
};

const testUser1 = {
  id: 5,
  userName: 'dylan',
  email: 'dylan@test.com',
  isAdmin: false,
  authID: 'lkjh',
};

const entry1 = {
  id: 9,
  title: 'test',
  embedID: '2d7s3spWAzo',
  thumbnailURL: 'yahoo.com',
  statistics: {
    stuff: 'test',
  },
  description: 'description',
  sortMetric: 100,
  userID: 5,
};

const testUser2 = {
  id: 2,
  userName: 'austin',
  email: 'dylan@test.com',
  isAdmin: false,
  authID: 'dhtfx',
};

const entry2 = {
  id: 10,
  title: 'test',
  embedID: 'DFP6UDgVJtE',
  thumbnailURL: 'yahoo.com',
  statistics: {
    stuff: 'test',
  },
  description: 'description',
  sortMetric: 1000,
  userID: 2,
};

const testUser3 = {
  id: 3,
  userName: 'Notaustin',
  email: 'dylajn@test.com',
  isAdmin: false,
  authID: 'dhtkx',
};

const entry3 = {
  id: 13,
  title: 'test',
  embedID: 'TWBDa5dqrl8',
  thumbnailURL: 'yahoso.com',
  statistics: {
    stuff: 'test',
  },
  description: 'description',
  sortMetric: 10000,
  userID: 3,
};

beforeEach_(function * generator() {
  yield TestHelper.emptyDb(db);
});


describe('The Youtube Model', () => {
  const sample = 'https://www.youtube.com/watch?v=FzRH3iTQPrk';
  const shortenedSample = 'http://bit.ly/OUv03h';

  describe('Gets Video Info', () => {
    it_('gets data from youtube', function * ytinfo() {
      const fetch = sinon.stub(request, 'fetch');
      fetch.resolves(ytOutput);
      const response = yield Youtube.getInfo(sample);
      expect(response).to.include(ytOutput);
      fetch.restore();
    });

    it_('expands a shortened youtube link', function * checkShortened() {
      const expand = sinon.stub(unshortener, 'expand');
      expand.resolves(sample);
      const fetch = sinon.stub(request, 'fetch');
      fetch.resolves(ytOutput);
      const response = yield Youtube.getInfo(shortenedSample);
      expect(response).to.include(ytOutput);
      fetch.restore();
      expand.restore();
    });
  });

  describe('Gets updated statistics for multiple videos', () => {
    it_('gets batch data from youtube', function * ytinfo() {
      yield Users.insert(testUser);
      yield Entries.create(entry);
      yield Users.insert(testUser1);
      yield Entries.create(entry1);
      yield Users.insert(testUser2);
      yield Entries.create(entry2);
      yield Users.insert(testUser3);
      yield Entries.create(entry3);
      const fetch = sinon.stub(request, 'fetch');
      fetch.resolves(ytBatchOutput);

      const batchResponse = yield Youtube.getBatchInfo();
      expect(fetch.calledWith(urlString)).to.equal(true);
      expect(batchResponse).to.deep.equal(ytBatchReturned);
      fetch.restore();
    });
  });
});

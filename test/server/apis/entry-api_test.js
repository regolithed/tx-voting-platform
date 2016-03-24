/* global TEST_HELPER describe beforeEach_ it_ TestHelper __server afterEach beforeEach expect */
'use strict';
require(TEST_HELPER);
const sinon = require('sinon');
const Entry = require(`${__server}/models/entries`);
const Youtube = require(`${__server}/models/youtube`);
const request = require('supertest');
const ytOutput = require('../models/ytResult').output;
require('sinon-as-promised');
const Sessions = require(`${__server}/models/sessions`);
const db = require(`${__server}/lib/db`);

describe('The Entries API', () => {
  let app = null;
  let modelStub = null;
  const data = { id: 1, url: 'youtube.com/sxsw' };
  
  beforeEach_(function * generator() {
    app = TestHelper.createApp();
  });

  afterEach(() => {
    if (modelStub) modelStub.restore();
  });

  describe('GET /entries', () => {
    it_('returns all entries', function * testLinks() {
      modelStub = sinon.stub(Entry, 'getEntriesWithUsers');
      modelStub.resolves(data);
      yield request(app)
        .get('/api/yt/entries?offset=1&limit=12')
        .expect(200)
        .expect(response => {
          expect(response.body.data).to.deep.equal(data);
          expect(modelStub.calledWith(1, 12));
        });
    });
  });

  describe.only('DELETE /entries', () => {
    it_('deletes an entry', function * deletesLinks() {
      modelStub = sinon.stub(Entry, 'remove');
      modelStub.resolves({ success: true });
      const sessionFetch = sinon.stub(Sessions, 'fetchByID');
      sessionFetch.resolves('test')
      // console.log('sessions', session)
      yield request(app)
        .delete('/api/yt/entries/1')
        .expect(200)
        .set('session-id', 'test')
        .expect(response => {
          console.log('responsesdfa', response.body)
          expect(modelStub.calledWith('1')).to.equal(true);
          expect(response.body.data.success).to.equal(true);
        });
    });
  });

  describe('PUT /entries', () => {
    it_('updates an entry', function * updateLink() {
      modelStub = sinon.stub(Entry, 'updateByID');
      modelStub.resolves(data);
      yield request(app)
        .put('/api/yt/entries/1')
        .expect(200)
        .expect(response => {
          expect(modelStub.calledWith('1')).to.equal(true);
          expect(response.body.data).to.include(data);
        });
    });
  });

  describe('POST /entries', () => {
    it_('posts a new entry', function * postsLinks() {
      modelStub = sinon.stub(Entry, 'create');
      modelStub.resolves(data);
      yield request(app)
        .post('/api/yt/entries')
        .expect(200)
        .expect(response => {
          expect(response.body.data).to.deep.equal(data);
        });
    });
  });
});

describe('The Youtube API', () => {
  let app = null;
  const info = 'https://www.youtube.com/watch?v=FzRH3iTQPrk';
  const badInfo = 'bit.ly/1pbHRQy';
  beforeEach(() => {
    app = TestHelper.createApp();
  });

  describe('GET /api/yt/entries/info', () => {
    it_('gets video info from Youtube', function * getYTInfo() {
      const getInfo = sinon.stub(Youtube, 'getInfo');
      getInfo.resolves(ytOutput);
      yield request(app)
        .get('/api/yt/entries/info')
        .expect(200)
        .query({ url: info })
        .expect((response) => {
          expect(response.body.data).to.have.property('items');
          expect(Youtube.getInfo.calledOnce).to.equal(true);
        });
      getInfo.restore();
    });

    it_('sends an error when an invalid url is submitted', function *urlValid() {
      const getInfo = sinon.stub(Youtube, 'getInfo');
      getInfo.rejects(new Error('Invalid protocol'));
      yield request(app)
        .get('/api/yt/entries/info')
        .query({ url: badInfo })
        .expect(200)
        .expect((response) => {
          expect(response.body.error.message).to.equal('Invalid protocol');
          expect(Youtube.getInfo.calledOnce).to.equal(true);
        });
      getInfo.restore();
    });
  });
});

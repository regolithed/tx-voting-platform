/* global TEST_HELPER describe it_ TestHelper __server afterEach beforeEach expect */
'use strict';
require(TEST_HELPER);
const sinon = require('sinon');
const Link = require(`${__server}/models/links`);
const Youtube = require(`${__server}/models/youtube`);
const request = require('supertest');
const ytOutput = require('../models/ytResult').output;
require('sinon-as-promised');

describe('The Links API', () => {
  let app = null;
  let modelStub = null;
  const data = { id: 1, url: 'youtube.com/sxsw' };
  beforeEach(() => {
    app = TestHelper.createApp();
  });

  afterEach(() => {
    if (modelStub) modelStub.restore();
  });

  describe('GET /links', () => {
    it_('returns all links', function * testLinks() {
      modelStub = sinon.stub(Link, 'read');
      modelStub.resolves(data);
      yield request(app)
        .get('/api/yt/links')
        .expect(200)
        .expect(response => {
          expect(response.body.links).to.include(data);
        });
    });
  });

  describe('DELETE /links', () => {
    it_('deletes a link', function * deletesLinks() {
      modelStub = sinon.stub(Link, 'remove');
      modelStub.resolves(data.id);
      yield request(app)
        .delete('/api/yt/links/1')
        .expect(200)
        .expect(response => {
          expect(response.body.link).to.equal(data.id);
          expect(Link.remove.calledOnce).to.equal(true);
          expect(Link.remove.calledWith('1')).to.equal(true);
        });
    });
  });

  describe('PUT /links', () => {
    it_('updates a link', function * updateLink() {
      modelStub = sinon.stub(Link, 'update');
      modelStub.resolves(data);
      yield request(app)
        .put('/api/yt/links/1')
        .expect(200)
        .expect(response => {
          expect(response.body.link).to.include(data);
          expect(Link.update.calledOnce).to.equal(true);
          expect(Link.update.calledWith('1')).to.equal(true);
        });
    });
  });

  describe('POST /links', () => {
    it_('posts a new link', function * postsLinks() {
      modelStub = sinon.stub(Link, 'create');
      modelStub.resolves(data);
      yield request(app)
        .post('/api/yt/links')
        .expect(200)
        .expect(response => {
          expect(response.body.returnedLink).to.include(data);
          expect(Link.create.calledOnce).to.equal(true);
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

  describe('GET /api/yt/links/info', () => {
    it_('gets video info from Youtube', function * getYTInfo() {
      const getInfo = sinon.stub(Youtube, 'getInfo');
      getInfo.resolves(ytOutput);
      yield request(app)
        .get('/api/yt/links/info')
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
        .get('/api/yt/links/info')
        .query({ url: badInfo })
        .expect(500)
        .expect((response) => {
          expect(response.text).to.equal('Invalid protocol');
          expect(Youtube.getInfo.calledOnce).to.equal(true);
        });
      getInfo.restore();
    });
  });
});

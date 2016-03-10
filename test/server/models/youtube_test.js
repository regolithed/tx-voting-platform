/* global TEST_HELPER describe it_ TestHelper __server beforeEach expect */
'use strict';
require(TEST_HELPER);
const sinon = require('sinon');
// const Link = require(`${__server}/models/links`);
const Youtube = require(`${__server}/models/youtube`);
const ytOutput = require('./ytResult').output;

require('sinon-as-promised');
// const fetch = require('isomorphic-fetch');
const request = require('../../../server/lib/request');


describe('The Youtube Model', () => {
  const sample = 'https://www.youtube.com/watch?v=FzRH3iTQPrk';
  const shortenedSample = 'http://bit.ly/OUv03h';

  describe('Get Video Info', () => {
    it_('gets data from youtube', function * ytinfo() {
      const fetch = sinon.stub(request, 'fetch');
      fetch.resolves(ytOutput);
      const response = yield Youtube.getInfo(sample);
      expect(response).to.equal(ytOutput);
      fetch.restore();
    });

    it_('expands a shortened youtube link', function * checkShortened() {
      const fetch = sinon.stub(request, 'fetch');
      fetch.resolves(ytOutput);
      const response = yield Youtube.getInfo(shortenedSample);
      expect(response).to.equal(ytOutput);
      fetch.restore();
    });
  });


  // describe('Shortens a shortened link')
});

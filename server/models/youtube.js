const Request = require('../lib/request');
const Youtube = module.exports;
const Config = require('../../config');
const Url = require('url');
// const unshortener = require('unshortener');
const unshortener = require('../lib/unshortener');

Youtube.getInfo = (url) => {
  'use strict';
  let shortenedUrl;
  const base = 'https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics,player&id=';
  if (url.indexOf('youtube.com') !== -1) {
    shortenedUrl = Promise.resolve(url);
  } else {
    shortenedUrl = unshortener.expand(url).then(urls => {
      return urls.href;
    });
  }
  return shortenedUrl.then(fullUrl => {
    const vidId = Url.parse(fullUrl, true).query.v;
    return `${base}${vidId}&key=${Config.key}`;
  })
  .then((cleanUrl) => {
    return Request.fetch(cleanUrl)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw new Error('Something went wrong with the link provided:', error);
    });
  });
};

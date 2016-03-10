const Request = require('../lib/request');
const Youtube = module.exports;
const Config = require('../../config');
const Url = require('url')
const unshortener = require('../lib/unshortener');


// const sample = 'https://www.youtube.com/watch?v=FzRH3iTQPrk';


Youtube.getInfo = (url) => {
  const base = 'https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics,player&id=';
  const vidId = url.slice(url.indexOf('v=') + 2);
  const newUrl = `${base}${vidId}&key=${Config.key}`;
  return Request.fetch(newUrl)
  .catch((error) => {
    console.log('ERROR:', error);
  });
};

Youtube.checkShortened = (url) => {
  if (url.indexOf('youtube.com') === -1) {
    const shortened = new Promise((resolve) =>
      unshortener.expand(url, (error, urls) => {
        if (error || urls.host !== 'www.youtube.com') {
          throw new Error('You entered an incorrect url');
        }
        return resolve(shortened);
      })
    ).then(() => {
      Youtube.getInfo(shortened);
    });
  } else {
    Youtube.getInfo(url);
  }
};


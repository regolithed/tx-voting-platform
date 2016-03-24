const Request = require('../../lib/request');
const unshortener = require('../lib/unshortener');
const Url = require('url');
const db = require('../lib/db');

const Youtube = module.exports;
const base = 'https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics,player&id=';
Youtube.getInfo = (url) => {
  'use strict';
  let shortenedUrl;
  if (url.indexOf('youtube.com') !== -1) {
    shortenedUrl = Promise.resolve(url);
  } else {
    shortenedUrl = unshortener.expand(url).catch(error => {
      if (error.message === 'Invalid protocol') throw new Error(`invalid entry url: ${url}`);
      else throw new Error('there was a problem on the server');
    });
  }
  return shortenedUrl.then(fullUrl => {
    const vidId = Url.parse(fullUrl, true).query.v;
    return `${base}${vidId}&key=${process.env.YOUTUBE_API_KEY}`;
  })
  .then((cleanUrl) => {
    return Request.fetch(cleanUrl)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw new Error('Something went wrong with the link provided:', error);
    });
  })
  .then(youtubeResponse => {
    if (youtubeResponse.items.length === 0) {
      throw new Error(`YouTube url: ${url} is invalid`);
    }
    return youtubeResponse;
  });
};

Youtube.getBatchInfo = () => {
  const refreshBase = 'https://www.googleapis.com/youtube/v3/videos?part=statistics&id=';
  const idArray = [];
  const resultArray = [];
  return db.select('embedID').from('entries')
  .returning('embedID')
  .then(response => {
    response.forEach(obj => {
      idArray.push(obj.embedID);
    });
    const idString = idArray.join(',');
    const cleanUrl = `${refreshBase}${idString}&key=${process.env.YOUTUBE_API_KEY}`;
    console.log(cleanUrl);
    return Request.fetch(cleanUrl)
    .then((resp) => {
      resp.items.forEach(entry => {
        console.log('entry', entry);
        resultsArray.push(entry.id);
      });
        return db('entries').where('embedID', entry.id)
        .returning('statistics')
        .update({ statistics: entry.statistics })
        .then(res => {
          resultArray.push(res);
        });
      return resultArray;
    })
    .then(result => {
      return result;
    })
  .catch((error) => {
    throw new Error('Something went wrong with the provided urls:', error);
  });
  });
};

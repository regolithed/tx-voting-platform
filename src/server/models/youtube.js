
const Request = require('../../lib/request');
const unshortener = require('../lib/unshortener');
const CronJob = require('cron').CronJob;
const Url = require('url');
const chunk = require('lodash/chunk');
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
  return db.select('embedID').from('entries')
  .returning('embedID')
  .then(response => {
    if (!response.length) {
      throw new Error('Database Read Error');
    }
    // map response to array of ids
    const idArray = response.map(obj => {
      return obj.embedID;
    });
    // chunk idArray into an array of smaller arrays
    const chunkedArray = chunk(idArray, 40);
    const mappedRequest = chunkedArray.map(array => {
      const idString = array.join(',');
      const cleanUrl = `${refreshBase}${idString}&key=${process.env.YOUTUBE_API_KEY}`;
      return Request.fetch(cleanUrl)
      .then(resp => {
        const resultArray = resp.items.map(entry => {
          return db('entries').where('embedID', entry.id)
          .returning('statistics')
          .update({ statistics: entry.statistics })
          .then(res => {
            return res[0];
          });
        });
        return Promise.all(resultArray);
      });
    });
    return Promise.all(mappedRequest);
  })
  .then(result => {
    return result[0];
  })
  .catch(() => {
    throw new Error('Database Read Error: Invalid Url');
  });
};
// '00 00 0,12 * * 0-6' - for firing cron every day at noon and midnight
const job = new CronJob('00 00 0,12 * * 0-6', () => {
  Youtube.getBatchInfo();
  const d = new Date();
  console.log('==============Cronjob has fired at:', d.toLocaleString(), '==========');
}, null, true, 'America/Chicago');

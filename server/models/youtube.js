const Request = require('../lib/request');
const Youtube = module.exports;
const Config = require('../../config');
const Url = require('url');
// const unshortener = require('unshortener');
const unshortener = require('../lib/unshortener');

Youtube.getInfo = (url) => {
  return new Promise((resolve) => {
    var vidId;
    var newUrl;
    const base = 'https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics,player&id=';
    // https://www.youtube.com/watch?v=FzRH3iTQPrk
    // return new Promise((resolve) => {
      // if (url.indexOf('youtube.com') === -1) {
    return new Promise((resolve) => {
      unshortener.expand(url, (error, urls) => {
        if (error || urls.host !== 'www.youtube.com') {
          throw new Error('There is something wrong with the shortened link.');
        }
        console.log('youtube.unshorten..............', urls);
        vidId = urls.query.slice(2);
        newUrl = `${base}${vidId}&key=${Config.key}`;
        console.log("NEW URL", newUrl)
        // return Request.fetch(newUrl)
        // .catch((error) => {
        //   console.log('ERRORING:', error);
        // });
      return resolve(newUrl);
    });
    }).then(() => {
        return resolve(Request.fetch(newUrl))
    });
  })
};
// Youtube.getInfo = (url) => {
//   console.log("URL______________________", url)
//   const base = 'https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics,player&id=';
//   const vidId = url.slice(url.indexOf('v=') + 2);
//   console.log("VID ID", vidId);
//   const newUrl = `${base}${vidId}&key=${Config.key}`;
//   return Request.fetch(newUrl)
//   .catch((error) => {
//     console.log('ERROR:', error);
//   });
// };

// Youtube.checkShortened = (url) => {
//   console.log("URL", url);
//   if (url.indexOf('youtube.com') === -1) {
//     return new Promise((resolve) => {
//       var shortened = unshortener.expand(url, (error, urls) => {
//         if (error) {
//           throw new Error('You entered an incorrect url');
//         }
//       });
//       return resolve(shortened);
//     });
//     // .then((response) => {
//     //   return response
//     // });
//       Youtube.getInfo(shortened);
//   } else {
//     Youtube.getInfo(url);
//   }
// };

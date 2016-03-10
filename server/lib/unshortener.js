const unshortener = require('unshortener');

module.exports = {
  expand: function unexpand(url) {
    return new Promise((resolve, reject) => {
      unshortener.expand(url, (error, urls) => {
        if (error) {
          reject(error);
        } else {
          resolve(urls);
        }
      });
    });
  },
};

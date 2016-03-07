// const db = require('../lib/db');
const Link = module.exports;

const links = {
  yt: {
    1: 'youtube.com/xyz',
    2: 'youtube.com/abc',
    3: 'youtube.com/def',
    4: 'youtube.com/ghi',
  },
};

// Link.create = function create(attrs) {
// };

Link.read = function read() {
  return new Promise((resolve) => {
    return resolve(links.yt);
  });
};

// Link.update = function update(attrs) {
// };

Link.remove = function remove(id) {
  return new Promise((resolve) => {
    console.log('link delete', links.yt[id]);
    var temp = links.yt[id];
    delete(links.yt[id])
    return resolve(temp);
  });
};

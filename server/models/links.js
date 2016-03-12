const db = require('../lib/db');
const Link = module.exports;

Link.create = function create(link) {
  return db('entries').create(link);
  // return new Promise((resolve) => {
  //   return resolve(links.yt[link.id] = link.url);
  // });
};

Link.read = function read() {
  return db('entries').read();
  // return new Promise((resolve) => {
  //   return resolve(links.yt);
  // });
};

Link.update = function update(id, fields) {
  return db('entries').update(id, fields);
  // return new Promise((resolve) => {
  //   resolve(links.yt[link.id] = link.url);
  // });
};

Link.remove = function remove(id) {
  return db('entries').delete(id);
  // return new Promise((resolve) => {
  //   console.log('link delete', links.yt[id]);
  //   const temp = links.yt[id];
  //   delete(links.yt[id]);
  //   return resolve(temp);
  // });
};


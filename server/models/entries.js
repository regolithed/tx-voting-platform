const db = require('../lib/db');
const Entry = module.exports;

Entry.create = function create(entry) {
  return db('entries').create(entry);
};

Entry.read = function read() {
  return db('entries').read();
};

Entry.update = function update(id, fields) {
  return db('entries').update(id, fields);
};

Entry.remove = function remove(id) {
  return db('entries').delete(id);
};


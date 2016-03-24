const db = require('../lib/db');
const Sessions = module.exports;
const uuid = require('uuid');
const Immutable = require('immutable');

const fieldsArray = [
  'id',
  'isAdmin',
  'userID',
];

Sessions.create = (fields) => {
  fields.id = Sessions.getID();
  return db('sessions').insert(fields, fieldsArray)
  .then(response => {
    return response[0].id;
  })
  .catch(error => {
    console.log('Error in session insert:', error);
    throw new Error('user database insert error');
  });
};

Sessions.getID = () => {
  return uuid.v1();
};

Sessions.fetchByID = (id) => {
  return db('sessions').where('id', id)
    .then(response => response[0] || Promise.reject(new Error('Invalid session ID')));
};

Sessions.deleteByUserID = (userID) => {
  return db('sessions').where('userID', userID).del()
  .then(() => userID);
};

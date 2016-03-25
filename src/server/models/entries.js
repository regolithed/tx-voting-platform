const db = require('../lib/db');
const User = require('./users');
const Entry = module.exports;
const fieldsArray = [
  'id',
  'thumbnailURL',
  'title',
  'embedID',
  'description',
  'statistics',
  'sortMetric',
  'userID',
];

const userFields = [
  'userName',
  'userID',
  'email',
  'photo',
  'isAdmin',
  'authID',
];

Entry.create = function create(entry) {
  // we can't expose the userIDs to the client
  // so we're using an authID here
  const { userAuthID } = entry;
  delete entry.userAuthID;
  return User.findByAuthID(userAuthID).then(user => {
    entry.userID = user.id;
    return entry;
  })
  .then(updatedEntry => {
    return db('entries').insert(updatedEntry, fieldsArray)
      .then(response => response[0])
      .catch((error) => {
        console.log('Error in Create:', error);
        throw new Error('Database Create error');
      });
  });
};

Entry.userIsAllowedAccess = (entryID, userID) => {
  return Entry.createdByUser(entryID, userID)
  .then(createdByUser => {
    console.log('createdByUser', createdByUser);
    return createdByUser || Promise.reject(new Error('Not allowed to edit this entry'));
  });
};

Entry.read = function read() {
  return db.select('*').from('entries')
  .catch((error) => {
    console.log('Error in Read:', error);
    throw new Error('Database Read error');
  });
};

Entry.fetchByID = (id) => {
  return db('entries').where('id', id)
    .select('*')
    .then(entries => entries[0]);
};

Entry.updateByID = function update(id, fields) {
  return db('entries').where('id', id)
  .returning(fieldsArray)
  .update(fields)
  .then(
    (response) => {
      if (response.length === 0) throw new Error('Attempted to update invalid user');
      return response[0];
    },
    (error) => {
      console.log('Error in Update:', error);
      throw new Error('Database Update error');
    }
  );
};

Entry.createdByUser = (entryID, userID) => {
  return Entry.fetchByID(entryID).then(entry => userID === entry.userID);
};

Entry.remove = function remove(id) {
  return db('entries').where('id', id)
  .returning('id')
  .del()
  .catch((error) => {
    console.log('Error in Remove:', error);
    throw new Error('Database Remove error');
  })
  .then((response) => {
    if (response.length === 0) throw new Error('Attempted to delete invalid ID');
    return { success: true };
  });
};

Entry.getEntriesWithUsers = function getUsersEntries(offset = 0, limit = 12) {
  return db.select('*').from('users').rightJoin('entries', 'entries.userID', 'users.id')
  .orderBy('sortMetric', 'desc')
  .offset(offset).limit(limit)
  .then(response => {
    const entries = response.map(item => {
      const user = {};
      const entry = {};
      userFields.forEach(field => {
        user[field] = item[field];
      });
      fieldsArray.forEach(field => {
        entry[field] = item[field];
      });
      entry.user = user;
      return entry;
    });
    return entries;
  })
  .catch(error => {
    console.log('Error in getEntriesWithUsers:', error);
    throw new Error('Database Read All Entries and Users error');
  });
};

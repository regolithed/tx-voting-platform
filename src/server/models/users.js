const db = require('../lib/db');
const Users = module.exports;
const Sessions = require('./sessions');

const fieldsArray = [
  'id',
  'userName',
  'email',
  'photo',
  'isAdmin',
  'authID',
];

Users.insert = (fields) => {
  return db('users').insert(fields, fieldsArray)
  .then(response => {
    return response[0];
  })
  .catch(error => {
    console.log('Error in users insert:', error);
    throw new Error('user database insert error');
  });
};

Users.update = (authID, fields) => {
  return db('users').where('authID', authID)
  .returning(fieldsArray)
  .update(fields)
  .then(response => {
    return response[0];
  })
  .catch(error => {
    console.log('Error in Users update:', error);
    throw new Error('User database update error');
  });
};

Users.delete = (id) => {
  return db('users').where('id', id)
  .returning('id')
  .del()
  .catch(error => {
    console.log('Error in Users delete:', error);
    throw new Error('User database delete error');
  })
  .then(response => {
    if (response.length === 0) throw new Error('Attempted to delete invalid user id');
    return { success: true, id: response[0] };
  });
};

Users.findByAuthID = (authID) => {
  return db('users').where('authID', authID)
  .returning(fieldsArray)
  .catch(error => {
    console.log('Error finding user:', error);
    throw new Error('Cannot find provided user');
  })
  .then(response => {
    if (response.length === 0) throw new Error('User does not exist');
    return response[0];
  });
};

Users.login = (authID, fields) => {
  return Users.insertOrUpdateUsingAuthID(authID, fields)
    .then(user => Sessions.deleteByUserID(user.id).then(() => user))
    .then(user => {
      return Sessions.create({ isAdmin: user.isAdmin, userID: user.id })
      .then(sessionID => {
        delete user.id;
        return {
          userData: user,
          sessionID,
        };
      });
    });
};

Users.insertOrUpdateUsingAuthID = (authID, fields) => {
  return Users.findByAuthID(authID)
  .then(() => {
    return Users.update(authID, fields);
  })
  .catch(error => {
    // this is how we know that the user
    // doesnt' exist
    if (error.message !== 'User does not exist') {
      throw error;
    } else {
      return Users.insert(fields);
    }
  })
  .catch(error => {
    console.log('Insert error in insertOrUpdate:', error);
    throw new Error('user database insert error');
  });
};

Users.getEntriesForUser = (authID) => {
  return db('users').where('authID', authID)
  .then(user => {
    return db.select('*').from('entries')
    .where('userID', user[0].id)
    .then(entries => {
      return entries;
    })
    .catch(error => {
      console.log('Insert error in getEntriesForUser:', error);
      throw new Error('user database insert error');
    });
  })
  .catch(error => {
    console.log('Insert error in getEntriesForUser:', error);
    throw new Error('user database insert error');
  });
};

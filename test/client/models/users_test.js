/* global TEST_HELPER describe it_ TestHelper __client __lib afterEach expect */
'use strict';
require(TEST_HELPER);
const sinon = require('sinon');
const User = require(`${__client}/models/user`);
const request = require(`${__lib}/request`);
require('sinon-as-promised');

const fakeUser = {
  id: 1,
  userName: 'Frank',
  email: 'frank@example.com',
  photo: 'thisIsAPhoto',
  isAdmin: false,
  authID: 'asdgq',
};

const fakeUser1 = {
  id: 1,
  isAdmin: false,
  authID: 'asdgq',
};

const returnedFakeUser = {
  data: {
    id: 1,
    userName: 'Frank',
    email: 'frank@example.com',
    photo: 'thisIsAPhoto',
    isAdmin: false,
    authID: 'asdgq',
  },
  error: null,
};

const returnedFakeUser1 = {
  data: {
    success: true,
  },
  error: null,
};

const returnedFakeUser2 = {
  data: {
    success: false,
  },
  error: null,
};

const args = [
  '/api/yt/users/asdgq',
  { method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fakeUser),
  },
];

const invalidUser = {
  data: [],
  error: {
    // code: error.statusCode,
    message: 'User does not exist',
  },
};

const invalidUser1 = {
  data: [],
  error: {
    // code: error.statusCode,
    message: 'user database insert error',
  },
};

const entry = {
  id: 8,
  title: 'test',
  embedID: '5',
  thumbnailURL: 'google.com',
  statistics: {
    stuff: 'test',
  },
  description: 'description',
  sortMetric: 19,
  userID: 1,
};

describe('The Users API', () => {
  let fetch = null;

  afterEach(() => {
    if (fetch) fetch.restore();
  });

  describe('The Client User models getByAuthID', () => {
    it_('sends a users\'s authId to the server and recieves a user', function * fetchUser() {
      fetch = sinon.stub(request, 'clientFetch');
      fetch.resolves(returnedFakeUser);
      const getUser = yield User.getByAuthID('asdgq');
      expect(fetch.calledWith('/api/yt/users/asdgq')).to.equal(true);
      expect(getUser).to.deep.equal(returnedFakeUser);
    });
    it_('returns an error if the authId is invalid', function * getError() {
      fetch = sinon.stub(request, 'clientFetch');
      fetch.rejects(invalidUser);
      try {
        yield User.getByAuthID('vvv');
      } catch (error) {
        expect(error).to.deep.equal(invalidUser);
      }
    });
  });

  describe('The Client User models insertOrUpdate', () => {
    it_('returns a user that is either created or updated', function * insert() {
      fetch = sinon.stub(request, 'clientFetch');
      fetch.resolves(returnedFakeUser);
      const insertOrUpdateMaybe = yield User.insertOrUpdate('asdgq', fakeUser);
      expect(fetch.calledWith(args[0], args[1])).to.equal(true);
      expect(insertOrUpdateMaybe).to.deep.equal(returnedFakeUser);
    });
    it_('returns an error if required fields are missing', function * insertError() {
      fetch = sinon.stub(request, 'clientFetch');
      fetch.rejects(invalidUser1);
      try {
        yield User.insertOrUpdate('asdgq', fakeUser1);
      } catch (error) {
        expect(error).to.deep.equal(invalidUser1);
      }
    });
  });

  describe('The Client User model delete', () => {
    it_('deletes a user given the usersID', function * remove() {
      fetch = sinon.stub(request, 'clientFetch');
      fetch.resolves(returnedFakeUser1);
      const removeUser = yield User.delete(1);
      expect(fetch.calledWith('/api/yt/users/1')).to.equal(true);
      expect(removeUser).to.deep.equal(returnedFakeUser1);
    });
    it_('returns false in succes if the userId could not be found', function * deleteError() {
      fetch = sinon.stub(request, 'clientFetch');
      fetch.resolves(returnedFakeUser2);
      const noUser = yield User.delete(2);
      expect(noUser).to.deep.equal(returnedFakeUser2);
    });
  });

  describe('The client User model getEntriesForUser', () => {
    it_('returns all entries associated with a user', function * getUserEntries() {
      fetch = sinon.stub(request, 'clientFetch');
      fetch.resolves(entry);
      const gotEntry = yield User.getEntriesForUser('asdgq');
      expect(fetch.calledWith('/api/yt/users/entries/asdgq')).to.equal(true);
      expect(gotEntry).to.deep.equal(entry);
    });
  });

  describe('The client User model login method', () => {
    it_('returns all entries associated with a user', function * getUserEntries() {
      fetch = sinon.stub(request, 'clientFetch');
      fetch.resolves(entry);
      const gotEntry = yield User.getEntriesForUser('asdgq');
      expect(fetch.calledWith('/api/yt/users/entries/asdgq')).to.equal(true);
      expect(gotEntry).to.deep.equal(entry);
    });
  });
});

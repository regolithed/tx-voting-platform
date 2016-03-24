/* global TEST_HELPER describe it_ db afterEach TestHelper __server beforeEach beforeEach_ expect */
'use strict';
require(TEST_HELPER);
const Users = require(`${__server}/models/users`);
require('sinon-as-promised');
const db = require(`${__server}/lib/db`);
const sinon = require('sinon');
const Entries = require(`${__server}/models/entries`);
const Sessions = require(`${__server}/models/sessions`);

const fakeUser = {
  id: 1,
  userName: 'Frank',
  email: 'frank@example.com',
  photo: 'thisIsAPhoto',
  isAdmin: false,
  authID: 'asdgq',
};

const badUser = {
  userName: 'Person',
};

const fakeUser2 = {
  id: 2,
  userName: 'Gary',
  email: 'gary@example.com',
  photo: 'wgwefg',
  isAdmin: false,
  authID: 'juilf',
};

const newUserInfo = {
  userName: 'Person',
};

const updatedFakeUser = {
  id: 1,
  userName: 'Person',
  email: 'frank@example.com',
  photo: 'thisIsAPhoto',
  isAdmin: false,
  authID: 'asdgq',
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

describe('The User Model (server)', () => {

  beforeEach_(function * generator() {
    yield TestHelper.emptyDb(db);
  });

  describe('after creating a user', () => {
    it_('adds a user to the database', function * addsAUser() {
      // take in user info
      const insertedUser = yield Users.insert(fakeUser);
      // returns a response from the database
      const readUser = yield TestHelper.db('users').read();
      expect(readUser[0]).to.deep.equal(insertedUser);
      // error handled if incorrect info provided
    });

    it_('throws an error if required fields are missing', function * updatesUser() {
      try {
        yield Users.insert(badUser);
      } catch (error) {
        expect(error.message).to.equal('user database insert error');
      }
    });
  });

  describe('when updating user info', () => {
    it_('updates a user\'s data in the database', function * updatesUser() {
      yield Users.insert(fakeUser);
      // takes in an id and an object with user info
      const updatedUser = yield Users.update('asdgq', newUserInfo);
      // returns a response from the data base
      expect(updatedUser).to.contain(newUserInfo);
      // error handled if incorrect data provided
      // error handled if user not in db
    });

    it_('throws an error if user id does not exist', function * updateError() {
      try {
        yield Users.update('sdgh', newUserInfo);
      } catch (error) {
        expect(error.message).to.equal('User database update error');
      }
    });
  });

  describe('when deleting a user from the database', () => {
    it_('deletes a user\'s data in the database', function * updatesUser() {
      // insert a fake user
      yield Users.insert(fakeUser);
      // delete fake user
      const deletedUser = yield Users.delete(1);
      // check response from the database is the id
      expect(deletedUser).to.deep.equal({ success: true, id: 1 });

      // call findByAuthID expect to not be there
      try {
        yield Users.findByAuthID('asdgq');
      } catch (error) {
        expect(error.message).to.equal('User does not exist');
      }
    });

    it_('throws an error if delete not successful', function * deleteError() {
      try {
        yield Users.delete(0);
      } catch (error) {
        expect(error.message).to.equal('Attempted to delete invalid user id');
      }
    });
  });

  describe('when finding a user by authID', () => {
    it_('returns a user\'s data from the database', function * findsUser() {
      yield Users.insert(fakeUser);
      // pass in an authID
      const foundUser = yield Users.findByAuthID('asdgq');
      // check returned user object
      expect(foundUser).to.deep.equal(fakeUser);
    });
    it_('throws error if authID not in database', function * errorOnFind() {
      try {
        yield Users.findByAuthID('kmpip');
      } catch (error) {
        expect(error.message).to.equal('User does not exist');
      }
    });
  });

  describe('when calling insertOrUpdateUsingAuthID', () => {
    it_('inserts a user if authID not in database', function * insertCheck() {
      yield Users.insertOrUpdateUsingAuthID('juilf', fakeUser2);
      const foundUser2 = yield Users.findByAuthID('juilf');
      expect(foundUser2).to.deep.equal(fakeUser2);
    });

    it_('updates user info if authID in database', function * updateCheck() {
      yield Users.insert(fakeUser);
      const foundUser3 = yield Users.insertOrUpdateUsingAuthID('asdgq', newUserInfo);
      expect(foundUser3).to.deep.equal(updatedFakeUser);
    });
  });

  describe('when calling getEntriesForUser', () => {
    it_('returns all entries associated with a user', function * getUserEntries() {
      yield Users.insert(fakeUser);
      yield Entries.create(entry);
      const gotEntries = yield Users.getEntriesForUser('asdgq');
      expect(gotEntries[0]).to.deep.equal(entry);
    });

    it_('throws error if authID not in database', function * errorOnFind() {
      try {
        yield Users.getEntriesForUser('kmpip');
      } catch (error) {
        expect(error.message).to.equal('user database insert error');
      }
    });
  });

  describe('when calling User.login', () => {
    let insertStub = null;
    let deleteStub = null;
    let createSessionStub = null;
    let getIDStub = null;
    beforeEach(() => {
      getIDStub = sinon.stub(Sessions, 'getID');
      insertStub = sinon.stub(Users, 'insertOrUpdateUsingAuthID');
      deleteStub = sinon.stub(Sessions, 'deleteByUserID');
      createSessionStub = sinon.stub(Sessions, 'create');
    });
    afterEach(() => {
      getIDStub.restore();
      insertStub.restore();
      deleteStub.restore();
      createSessionStub.restore();
    });
    it_('deletes an existing session, creates a new session and retuns the session id', function * login() {
      insertStub.resolves({
        id: 1,
        isAdmin: false,
        photo: 'test.jpg',
      });
      deleteStub.resolves(1);
      getIDStub.returns('test');
      createSessionStub.resolves('test');
      const authID = 'auth';
      const userData = {
        photo: 'test.jpg',
      };
      const result = yield Users.login(authID, userData);
      expect(createSessionStub.calledWith({ isAdmin: false, userID: 1 }), 'passed into create session').to.equal(true);
      expect(insertStub.calledWith(authID, userData), 'passed into insert').to.equal(true);
      expect(deleteStub.calledWith(1), 'passed into delete');
      expect(result.sessionID, 'session ID').to.equal('test');
      expect(result.userData, 'userData').to.deep.equal({ isAdmin: false, photo: 'test.jpg' });
    });
    it_('throws error if authID not in database', function * errorOnFind() {
      try {
        yield Users.getEntriesForUser('kmpip');
      } catch (error) {
        expect(error.message).to.equal('user database insert error');
      }
    });
  });
});


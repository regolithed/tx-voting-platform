/* global TEST_HELPER describe it_ TestHelper __server afterEach beforeEach expect */
'use strict';
require(TEST_HELPER);
const sinon = require('sinon');
const User = require(`${__server}/models/users`);
const request = require('supertest');
require('sinon-as-promised');

const fakeUser = {
  id: 1,
  userName: 'Frank',
  email: 'frank@example.com',
  photo: 'thisIsAPhoto',
  isAdmin: false,
  authID: 'asdgq',
};

const testError = 'User does not exist';

const testError1 = 'user database insert error';

const testError2 = 'Attempted to delete invalid user id';

const testError3 = 'user database insert error';

const success = { success: true, id: 1 };

describe('The Users API', () => {
  let app = null;
  let modelStub = null;
  beforeEach(() => {
    app = TestHelper.createApp();
  });

  afterEach(() => {
    if (modelStub) modelStub.restore();
  });

  describe('when calling GET /users', () => {
    it_('returns a users data when given an authID', function * getByID() {
      modelStub = sinon.stub(User, 'findByAuthID');
      modelStub.resolves(fakeUser);
      yield request(app)
        .get('/api/yt/users/asdgq')
        .expect(200)
        .expect(response => {
          expect(modelStub.calledWith('asdgq')).to.equal(true);
          expect(response.body.data).to.deep.equal(fakeUser);
        });
    });
    it_('returns an error if authID not found in database', function * checkError() {
      modelStub = sinon.stub(User, 'findByAuthID');
      modelStub.rejects(testError);
      yield request(app)
        .get('/api/yt/users/null')
        .expect(200)
        .expect(response => {
          expect(response.body.error.message).to.deep.equal(testError);
        });
    });
  });

  describe('when calling POST to insert or update using authID', () => {
    it_('returns the user object when given an authID and fields', function * insertOrUpdate() {
      modelStub = sinon.stub(User, 'login');
      modelStub.resolves(fakeUser);
      yield request(app)
      .post('/api/yt/users/asdgq')
      .send(fakeUser)
      .expect(200)
      .expect(response => {
        expect(response.body.data, 'response body').to.deep.equal(fakeUser);
        expect(modelStub.calledWith('asdgq', fakeUser), 'called with').to.equal(true);
      });
    });
    it_('returns an error if there are incomplete fields', function * insertOrUpdateError() {
      modelStub = sinon.stub(User, 'insertOrUpdateUsingAuthID');
      modelStub.rejects(testError1);
      yield request(app)
      .post('/api/yt/users/asdgq')
      .expect(200)
      .expect(response => {
        expect(response.body.error.message).to.deep.equal(testError1);
      });
    });
  });

  describe('when calling DELETE to delete a user via user ID', () => {
    it_('returns a success object containg the user id upon success', function * delUser() {
      modelStub = sinon.stub(User, 'delete');
      modelStub.resolves(success);
      yield request(app)
      .delete('/api/yt/users/1')
      .expect(200)
      .expect(response => {
        expect(modelStub.calledWith('1')).to.equal(true);
        expect(response.body.data).to.deep.equal(success);
      });
    });
    it_('returns an error if the user id is invalid', function * delUser() {
      modelStub = sinon.stub(User, 'delete');
      modelStub.rejects(testError2);
      yield request(app)
      .delete('/api/yt/users/1')
      .expect(200)
      .expect(response => {
        expect(response.body.error.message).to.deep.equal(testError2);
      });
    });
  });

  describe('when calling getEntriesForUser', () => {
    it_('returns a success object containing the user\'s entries', function * getEntries() {
      modelStub = sinon.stub(User, 'getEntriesForUser');
      modelStub.resolves(success);
      yield request(app)
      .get('/api/yt/users/entries/1')
      .expect(200)
      .expect(response => {
        expect(modelStub.calledWith('1')).to.equal(true);
        expect(response.body.data).to.deep.equal(success);
      });
    });
    it_('returns an error if the user id is invalid', function * delUser() {
      modelStub = sinon.stub(User, 'getEntriesForUser');
      modelStub.rejects(testError3);
      yield request(app)
      .get('/api/yt/users/entries/1')
      .expect(200)
      .expect(response => {
        expect(response.body.error.message).to.deep.equal(testError3);
      });
    });
  });
});

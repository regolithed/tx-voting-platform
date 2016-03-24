/* global TEST_HELPER afterEach_ describe it_ db TestHelper __server afterEach beforeEach_ expect */
'use strict';
require(TEST_HELPER);
const Sessions = require(`${__server}/models/sessions`);
require('sinon-as-promised');
const sinon = require('sinon');
const db = require(`${__server}/lib/db`);

describe('The sessions model', () => {
  let sessionIDStub = null;

  beforeEach_(function * generator() {
    sessionIDStub = sinon.stub(Sessions, 'getID');
    yield TestHelper.emptyDb(db);
    const testUser = {
      id: 1,
      userName: 'clay',
      email: 'clay@test.com',
      isAdmin: false,
      authID: 'qgraerdfb',
    };
    yield TestHelper.db('users').create(testUser);
  });

  afterEach(() => {
    sessionIDStub.restore();
  });

  it_('inserts a new session on session create', function * insert() {
    sessionIDStub.returns('test');
    const sessionInput = {
      isAdmin: false,
      userID: 1,
    };
    const sessionResult = yield Sessions.create(sessionInput);
    expect(sessionResult, 'Session returns session id').to.equal('test');
    const readSessions = yield TestHelper.db('sessions').read();
    expect(readSessions[0], 'session is read from db').to.deep.equal(sessionInput);
  });
  it_('returns the session for a session ID', function * insert() {
    const testSession = {
      id: 'test',
      isAdmin: false,
      userID: 1,
    };
    yield TestHelper.db('sessions').create(testSession);
    const sessionResult = yield Sessions.fetchByID('test');
    expect(sessionResult, 'Session returns found session').to.deep.equal(testSession);
  });
  it_('throws an error if the session does not exist', function * insert() {
    let throwError = null;
    const testSession = {
      id: 'test',
      isAdmin: false,
      userID: 1,
    };
    yield TestHelper.db('sessions').create(testSession);
    try {
      yield Sessions.fetchByID('blerg');
    } catch (error) {
      throwError = error;
    }
    expect(throwError.message).to.deep.equal('Invalid session ID');
  });

  it_('deletes a existing session with the matching user id', function * insert() {
    const testSession = {
      id: 'test',
      isAdmin: false,
      userID: 1,
    };
    yield TestHelper.db('sessions').create(testSession);
    const deletedID = yield Sessions.deleteByUserID(1);
    expect(deletedID).to.equal(1);
    const unDeletedID = yield Sessions.deleteByUserID(10);
    expect(unDeletedID).to.equal(10);
    const readSessions = yield TestHelper.db('sessions').read();
    expect(readSessions.length).to.equal(0);
  });


});

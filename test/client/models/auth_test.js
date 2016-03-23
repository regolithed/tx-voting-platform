/* global TEST_HELPER describe it_ it TestHelper beforeEach __client __lib afterEach expect */
'use strict';
require(TEST_HELPER);
const MockLocalStorage = require('mock-localstorage');
const jsdom = require('jsdom-global');
const sinon = require('sinon');
jsdom();
const OAuth = require('oauthio-web').OAuth;
const Auth = require(`${__client}/models/auth`);
const User = require(`${__client}/models/user`);
require('sinon-as-promised');

describe('The Auth client model', () => {
  let loginThroughFacebookStub = null;
  let insertOrUpdateStub = null;
  let clearCacheStub = null;

  beforeEach(() => {
    clearCacheStub = sinon.stub(OAuth, 'clearCache');
    global.localStorage = new MockLocalStorage();
    loginThroughFacebookStub = sinon.stub(Auth, 'loginThroughFacebook');
    insertOrUpdateStub = sinon.stub(User, 'insertOrUpdate');
  });

  afterEach(() => {
    clearCacheStub.restore();
    loginThroughFacebookStub.restore();
    insertOrUpdateStub.restore();
  });

  it_('logs a user in', function * authUser() {
    const userResponse = {
      email: 'test@email.com',
      avatar: 'image.com',
      name: 'Clay Branch',
      id: '1000',
    };
    const expectedUser = {
      email: 'test@email.com',
      photo: 'image.com',
      authID: '1000',
      userName: 'Clay Branch',
      isAdmin: false,
    };
    loginThroughFacebookStub.resolves(userResponse);
    insertOrUpdateStub.resolves(expectedUser);
    const returnedUser = yield Auth.login();
    expect(JSON.parse(localStorage.getItem('db_user'))).to.deep.equal(expectedUser);
    expect(insertOrUpdateStub.calledWith('1000', expectedUser), 'model was called').to.equal(true);
    expect(returnedUser, 'output is correct').to.deep.equal(expectedUser);
  });
  it('logs a user out', () => {
    localStorage.setItem('db_user', 'test');
    Auth.logout();
    expect(localStorage.getItem('db_user')).to.equal('null');
    expect(clearCacheStub.callCount).to.equal(1);
  });
});

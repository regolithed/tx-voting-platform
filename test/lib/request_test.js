/* global TEST_HELPER describe it it_ TestHelper __server __client beforeEach afterEach expect */
'use strict';
require(TEST_HELPER);
const request = require(`${__lib}/request`);
const Auth = require(`${__client}/models/auth`);
const sinon = require('sinon');
require('sinon-as-promised');

describe('the clientFetch helper', () => {
  let fetchStub = null;
  let idStub = null;
  beforeEach(() => {
    idStub = sinon.stub(Auth, 'getSessionID');
    fetchStub = sinon.stub(request, 'fetch');
  });

  afterEach(() => {
    idStub.restore();
    fetchStub.restore();
  });

  it_('automatically adds session-id header', function * dispatch() {
    fetchStub.resolves({});
    idStub.returns('test');
    const url = 'localhost';
    const options = {
      method: 'POST',
    };
    request.clientFetch(url, options);
    expect(fetchStub.calledWith(url, {
      method: 'POST',
      headers: {
        'session-id': 'test',
      },
    })).to.equal(true);
  });
});

/* global TEST_HELPER describe it_ TestHelper __server beforeEach expect */
'use strict';
require(TEST_HELPER);
const sinon = require('sinon');
const Links = require(`${__server}/models/links`);
const ytOutput = require('./ytResult').output;
const unshortener = require('../../../server/lib/unshortener');
const request = require('../../../server/lib/request');
require('sinon-as-promised');

describe('The entries model', () => {
  beforeEach(() => {
    return TestHelper.emptyDb();
  });

  it_('reads an item into the entries models', function * insert() {
    const link = {
      title: 'test',
    };
    const insertResult = yield TestHelper.db('entries').create(link);
    expect(insertResult, 'insertResults').to.contain(link);
    const readLinks = yield Links.read();
    expect(readLinks[0]).to.contain(link);
    // TestHelper.db.read();
    // read and confirm that read works
    // this will use DB read not the model
  });

  it_('inserts an item into the entries models', function * insert() {
    const link = {
      title: 'test',
    };
    const insertResult = yield Links.create(link);
    expect(insertResult, 'insertResults').to.contain(link);
    const readLinks = yield TestHelper.db('entries').read();
    expect(readLinks[0]).to.contain(link);
    // TestHelper.db.read();
    // read and confirm that read works
    // this will use DB read not the model
  });

  it_('updates an item in the entries model', function * update() {
    const link = {
      title: 'test',
    };
    const newLink = {
      title: 'whatever',
    };
    const insertResult = yield Links.create(link);
    expect(insertResult, 'insertResults').to.contain(link);
    const updateResult = yield Links.update(1, newLink);
    expect(updateResult, 'updateResults').to.contain(newLink);
    const readLinks = yield TestHelper.db('entries').read();
    expect(readLinks[0]).to.contain(newLink);
  });

  it_('deletes an item in the entries model', function * remove() {
    const link = {
      title: 'test',
    };
    const insertResult = yield Links.create(link);
    expect(insertResult, 'insertResults').to.contain(link);
    const removeResult = yield Links.remove(1);
    expect(removeResult, 'removeResult').to.equal(1);
    const readLinks = yield TestHelper.db('entries').read();
    expect(readLinks).to.deep.equal([]);
  });
});

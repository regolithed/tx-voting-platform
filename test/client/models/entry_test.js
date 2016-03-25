/* global TEST_HELPER describe it_ TestHelper __client __lib afterEach expect */
'use strict';
require(TEST_HELPER);
const sinon = require('sinon');
const Entry = require(`${__client}/models/entry`);
const request = require(`${__lib}/request`);
const entryResult = require('./entry-result');
require('sinon-as-promised');

describe('The client entry model', () => {
  const data = entryResult.data;
  const updated = entryResult.updatedResult;
  const newData = entryResult.toUpdate;
  const dataResult = entryResult.result;
  let fetch = null;
  
  beforeEach(() => {
    fetch = sinon.stub(request, 'clientFetch');
  });

  afterEach(() => {
    fetch.restore();
  });

  it_('gets all entries when fetch is called', function * fetchEntry() {
    const entries = [
      { id: 1 },
    ];
    fetch.resolves(entries);
    const returnedEntries = yield Entry.fetch(1, 12);
    expect(fetch.calledWith('/api/yt/entries?limit=12&offset=1')).to.equal(true);
    expect(returnedEntries).to.equal(entries);
  });

  it_('adds an entry when create is called', function * createEntry() {
    const entry = { message: 'test' };
    const args = ['/api/yt/entries',
      { method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      },
    ];
    fetch.resolves(entry);
    const createAnEntry = yield Entry.create(entry);
    expect(fetch.calledWith(args[0], args[1])).to.equal(true);
    expect(createAnEntry.message).to.equal('test');
  });

  it_('takes a url and gets info from Youtube', function * getYTInfo() {
    fetch.resolves(data);
    const ytInfo = yield Entry.getInfo('http://bit.ly');
    expect(fetch.calledWith('/api/yt/entries/info?url=http%3A%2F%2Fbit.ly'), 'bitly url').to.equal(true);
    expect(ytInfo, 'data result').to.deep.equal(dataResult);
  });

  it_('updates an entry given an id and fields to update', function * updateEntry() {
    fetch.resolves(updated);
    const args = [`/api/yt/entries/${1}`,
      { method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      },
    ];
    const updatedEntry = yield Entry.update(1, newData);
    expect(fetch.calledWith(args[0], args[1]), 'passed into entry model').to.equal(true);
    expect(updatedEntry, 'entry output').to.deep.equal(updated);
  });

  it_('deletes an entry from the database', function * deleteEntry() {
    fetch.resolves(dataResult);
    const removedEntry = yield Entry.delete(1);
    expect(fetch.calledWith(`/api/yt/entries/${1}`)).to.equal(true);
    expect(removedEntry).to.deep.equal(dataResult);
  });
});

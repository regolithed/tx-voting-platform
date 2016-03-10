/* global TEST_HELPER describe it it_ TestHelper __server __client beforeEach expect */
'use strict';
require(TEST_HELPER);
import Immutable from 'immutable';
const { entries } = require(`${__client}/reducers/entries`);
const actions = require(`${__client}/actionCreators/entries`);

describe('The entries reducer', () => {
  it('sets entries array on receieve entries', () => {
    const entryResponse = [
      {
        id: 1,
        title: 'one',
      },
      {
        id: 2,
        title: 'two',
      },
    ];
    const state = entries(Immutable.fromJS({}), actions.receiveEntries(entryResponse)).toJS();
    expect(state.items).to.deep.equal(entryResponse);
    expect(state.isLoading).to.equal(false);
    expect(state.error).to.equal(null);
  });

  it('sets links error on receieve error', () => {
    const error = {
      message: 'test',
    };
    const state = entries(Immutable.fromJS({}), actions.receiveEntriesError(error)).toJS();
    expect(state.isLoading).to.equal(false);
    expect(state.error).to.deep.equal(error);
  });

  it('sets loading on request', () => {
    const state = entries(Immutable.fromJS({}), actions.requestEntries()).toJS();
    expect(state.isLoading).to.equal(true);
    expect(state.items).to.deep.equal([]);
  });
});
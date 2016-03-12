/* global TEST_HELPER describe it it_ TestHelper __server __client beforeEach expect */
'use strict';
require(TEST_HELPER);
const DbMocker = require(`${__server}/lib/db-mocker`);

describe('The db mocker', () => {
  let db = null;
  const collections = {
    todos: {
      mocks: [
        {
          text: 'one',
          completed: true,
        },
      ],
      delay: 100,
    },
  };
  beforeEach(() => {
    db = new DbMocker(collections);
  });

  it_('provides a db interface', function * generator() {
    db('todos').read.should.be.an('function');
    db('todos').create.should.be.an('function');
    db('todos').update.should.be.an('function');
    db('todos').delete.should.be.an('function');
  });

  it_('throws an error when accessing an invalid collection', function * generator() {
    expect(db.bind(null, 'foo_bar')).to.throw('foo_bar collection doesnt exist');
  });

});

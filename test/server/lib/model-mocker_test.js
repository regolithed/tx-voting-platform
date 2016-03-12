/* global TEST_HELPER describe it it_ TestHelper __server __client beforeEach expect */
'use strict';
require(TEST_HELPER);
const ModelMocker = require(`${__server}/lib/model-mocker`);

describe('The model mocker', () => {
  let Todo = null;
  const todos = {
    mocks: [
      {
        text: 'one',
        completed: true,
      },
      {
        text: 'two',
        completed: true,
      },
    ],
    delay: 1,
  };
  beforeEach(() => {
    Todo = new ModelMocker(todos);
  });


  it_('Inserts mock item on create', function * generator() {
    const todo = yield Todo.create({ text: 'three', completed: false });
    expect(todo).to.contain({ text: 'three', completed: false, id: 2 });
  });
  it_('gets all items on read', function * generator() {
    const readTodos = yield Todo.read();
    expect(readTodos[0]).to.contain({ text: 'one', id: 0 });
    expect(readTodos[1]).to.contain({ text: 'two', id: 1 });
  });
  it_('should be able to filter read results', function * generator() {
    const readTodos = yield Todo.read(item => item.text === 'two');
    expect(readTodos[0]).to.contain({ text: 'two', id: 1 });
  });
  it_('updates an item', function * generator() {
    const updatedItem = yield Todo.update(0, { text: 'updated' });
    expect(updatedItem).to.contain({ id: 0, text: 'updated' });
    const readTodos = yield Todo.read();
    expect(readTodos[0]).to.contain({ text: 'updated' });
  });
  it_('deletes an item', function * generator() {
    const deletedID = yield Todo.delete(0);
    expect(deletedID).to.equal(0);
    const readTodos = yield Todo.read();
    expect(readTodos[0]).to.contain({ text: 'two' });
  });

  it_('deletes all without an id', function * generator() {
    yield Todo.delete();
    const readTodos = yield Todo.read();
    expect(readTodos).to.deep.equal([]);
  });
});

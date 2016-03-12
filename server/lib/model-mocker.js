const Immutable = require('immutable');
const _ = require('underscore');

const ModelMocker = ({ mocks = [], delay = 500, errors = {} }) => {
  const mocker = {};

  const setMockID = (mock, index) => mock.set('id', index);

  const getInitialMocks = () => Immutable.fromJS(mocks).map(setMockID);

  let state = Immutable.fromJS({
    mocks: getInitialMocks(),
  });

  const getPromise = function getPromise(name, func, args) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (_.has(errors, name)) reject(errors[name]);
        resolve(func.apply(null, args));
      }, delay);
    });
  };

  const bindFunction = (name, func) => {
    mocker[name] = (...args) => getPromise(name, func, args);
  };

  const getMaxID = function getMaxID() {
    const getMax = (max, next) => next.get('id') > max ? next.get('id') : max;
    return state.get('mocks').reduce(getMax, 0);
  };

  const getIndexForID = (id) => state.get('mocks').findIndex(item => item.get('id') === id);
  const setMaxID = (item) => setMockID(item, getMaxID() + 1);

  bindFunction('create', (newItem) => {
    const item = setMaxID(Immutable.fromJS(newItem));
    state = state.updateIn(['mocks'], (items) => items.push(item));
    return state.get('mocks').last().toJS();
  });

  bindFunction('read', (filterFunc = _.identity) => state.get('mocks').toJS().filter(filterFunc));

  bindFunction('update', (id, fields) => {
    const updateField = (key, value, item) => item.set(key, value);
    const updateFields = (item) => Object.keys(fields).forEach(field => {
      updateField(field, fields[field], item);
    });
    const updateItem = (item) => item.withMutations(updateFields);
    const indexToUpdate = getIndexForID(id);
    const updateItems = (items) => items.update(indexToUpdate, updateItem);
    state = state.update('mocks', updateItems);
    return state.get('mocks').get(indexToUpdate).toJS();
  });

  bindFunction('delete', (id) => {
    if (id === undefined) {
      state = state.update('mocks', () => Immutable.fromJS([]));
    }
    state = state.deleteIn(['mocks', getIndexForID(id)]);
    return id;
  });

  return mocker;
};

module.exports = ModelMocker;

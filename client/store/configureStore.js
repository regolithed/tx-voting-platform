const Immutable = require('immutable');
const appReducer = require('../reducers/app');
const { routerMiddleware } = require('react-router-redux');
const { createStore, applyMiddleware } = require('redux');
const thunkMiddleware = require('redux-thunk');
const { browserHistory } = require('react-router');

const middleware = routerMiddleware(browserHistory);

const initialState = Immutable.Map();
module.exports = () => {
  return createStore(
    appReducer,
    initialState,
    applyMiddleware(thunkMiddleware, middleware)
  );
};

const { getAsyncAction } = require('../lib/redux-helpers');
require('es6-promise').polyfill();
const Auth = require('../models/auth');
const User = require('../models/user');
const { push } = require('react-router-redux');
const Immutable = require('immutable');
const actions = {};

actions.receiveLoggedInUser = (user) => ({
  type: 'RECEIVE_LOGGED_IN_USER',
  user,
});

actions.requestLoggedInUser = () => ({
  type: 'REQUEST_LOGGED_IN_USER',
});

actions.requestUser = () => ({
  type: 'REQUEST_USER',
});

actions.receiveUser = (user) => ({
  type: 'RECEIVE_USER',
  user,
});

actions.receiveUserError = (error, time = Date.now()) => ({
  type: 'RECEIVE_USER_ERROR',
  error,
  time,
});

actions.receiveLoggedInStatus = (status) => ({
  type: 'RECEIVE_LOGGED_IN_STATUS',
  status,
});

actions.receiveLoggedInUserError = (error) => ({
  type: 'RECEIVE_LOGGED_IN_USER_ERROR',
  error,
});

actions.receiveLoginResponse = (response) => ({
  type: 'RECEIVE_LOGIN_RESPONSE',
  response,
});

actions.clearUserData = () => ({
  type: 'CLEAR_USER_DATA',
});

actions.logOut = () => {
  return dispatch => {
    Auth.logout();
    dispatch(actions.clearUserData());
  };
};

actions.login = () => {
  return dispatch => getAsyncAction({
    dispatch,
    request: () => Auth.login(),
    onRequest: () => actions.requestLoggedInUser(),
    onSuccess: (user) => {
      return [
        actions.receiveLoginResponse(user),
        actions.receiveLoggedInUser(user),
        push('/'),
      ];
    },
    onError: (error) => actions.receiveLoggedInUserError(error),
  });
};

actions.redirectIfNotLoggedIn = () => {
  return dispatch => {
    if (!Auth.isLoggedIn()) {
      dispatch(push('/login'));
    }
  };
};

actions.fetchUser = (authID) => {
  return dispatch => getAsyncAction({
    dispatch,
    request: () => User.getByAuthID(authID),
    onRequest: () => actions.requestUser(),
    onSuccess: (user) => actions.receiveUser(user),
    onError: (error) => actions.receiveUserError(error),
  });
};

actions.populateProfileUser = (authID) => {
  return (dispatch, getState) => {
    // if the state isn't already populated
    if (getState().getIn(['user', 'data', 'authID']) !== authID) {
      dispatch(actions.fetchUser(authID));
    }
  };
};

actions.populateUserData = () => {
  return (dispatch, getState) => {
    const isLoggedIn = Auth.isLoggedIn();
    const user = getState().get('user');
    if (!user.get('isPopulated')) {
      dispatch(actions.receiveLoggedInStatus(isLoggedIn));
      if (isLoggedIn) dispatch(actions.receiveLoggedInUser(Auth.getCachedUser()));     
    }
  };
};


module.exports = actions;

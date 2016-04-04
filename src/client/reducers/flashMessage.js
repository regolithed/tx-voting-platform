import Immutable from 'immutable';
import { createReducer } from '../lib/redux-helpers';
import _ from 'underscore';

// All errors
const errorMap = {
  RECEIVE_NEW_ENTRY_ERROR: () => 'Failed to create new entry',
  RECEIVE_ENTRIES_ERROR: () => 'Something went wrong while fetching entries',
  RECEIVE_ENTRY_INFO_ERROR: (action) => action.error.message,
  RECEIVE_UPDATED_ENTRY_ERROR: () => 'Update failed, please try again',
  RECEIVE_ENTRY_DELETE_ERROR: (action) => action.error.message,
};

const successMap = {
  RECEIVE_NEW_ENTRY: () => 'Entry created successfully!',
  RECEIVE_UPDATED_ENTRY: () => 'Entry updated successfully!',
  RECEIVE_ENTRY_DELETE: () => 'Entry deleted successfully!',
  RECEIVE_LOGIN_RESPONSE: () => 'Logged in successfully!',
  CLEAR_USER_DATA: () => 'Logged out succesfully!',
};

const infoMap = {
  REQUEST_UPDATED_ENTRY: () => 'Updating Entry...',
  REQUEST_ENTRY_DELETE: () => 'Deleting Entry...',
};

// if the getter is a function
// passes the action into the getter
// and returns the result, otherwise just returns the getter
const actionWrap = (getter, action) => {
  return typeof getter === 'function' ? getter(action) : getter;
};

const getFlashMessage = (action, getMessage, getTime, getType) => {
  return Immutable.fromJS({
    type: actionWrap(getType, action),
    createdAt: actionWrap(getTime, action),
    message: actionWrap(getMessage, action),
    isVisible: true,
  });
};

const getError = (action, getErrorMessage) => {
  return getFlashMessage(
    action,
    () => actionWrap(getErrorMessage, action),
    () => action.time,
    () => 'warning',
  );
};

const getSuccess = (action, getMessage) => {
  return getFlashMessage(
    action,
    () => actionWrap(getMessage, action),
    () => action.time,
    () => 'success',
  );
};

const getInfo = (action, getMessage) => {
  return getFlashMessage(
    action,
    () => actionWrap(getMessage, action),
    () => action.time,
    () => 'info',
  );
};

// Map the simple error to the correct formap to be passed into
// create reducer
let reducerInput = _.reduce(errorMap, (output, getMessage, actionType) => {
  output[actionType] = (state, action) => getError(action, getMessage);
  return output;
}, {});

reducerInput = _.reduce(successMap, (output, getMessage, actionType) => {
  output[actionType] = (state, action) => getSuccess(action, getMessage);
  return output;
}, reducerInput);

reducerInput = _.reduce(infoMap, (output, getMessage, actionType) => {
  output[actionType] = (state, action) => getInfo(action, getMessage);
  return output;
}, reducerInput);

reducerInput.CLEAR_FLASH_MESSAGE = () => Immutable.fromJS({
  isVisible: false,
});

const initialState = Immutable.fromJS({
  isVisible: false,
});

export const flashMessage = createReducer(initialState, reducerInput);

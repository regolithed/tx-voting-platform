const R = require('ramda');
const createReducer = (initialState, handlers) => {
  return (state = initialState, action) => {
    return R.propOr(R.identity, action.type, handlers)(state, action);
  }
};

// This helper is a general function for dispatching actions
// before a request, after a request returns, and if it returns with an error
const getAsyncAction = ({ dispatch, request, onRequest, onSuccess, onError }) => {
  dispatch(onRequest());
  return request
    .then(response => {
      return dispatch(onSuccess(response));
    })
    .catch(error => dispatch(onError(error)));
};

module.exports = {
  createReducer,
  getAsyncAction,
};

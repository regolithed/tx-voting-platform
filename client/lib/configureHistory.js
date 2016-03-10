const { browserHistory } = require('react-router');
const { syncHistoryWithStore } = require('react-router-redux');

// Get routing information from the store,
// because we're using immutable, we need to customize
// how this works
const options = {
  selectLocationState: (state) => {
    return state.get('routing').toJS();
  },
};

module.exports = (store) => syncHistoryWithStore(browserHistory, store, options);

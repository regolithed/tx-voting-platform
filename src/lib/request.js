/*eslint-disable */
require('es6-promise').polyfill();
const queryString = require('query-string');
const fetch = require('isomorphic-fetch');
const request = {
  fetch: function jsonFetch(...args) {
    return fetch.apply(null, args).then(response => response.json());
  },
  addParams: (urlString, params) => {
    return `${urlString}?${queryString.stringify(params)}`;
  },
  clientFetch: (...args) => {
    const Auth = require('../client/models/auth');
    const options = args[1] || {};
    options.headers = options.headers || {};
    options.headers['session-id'] = Auth.getSessionID();
    args[1] = options;
    return request.fetch.apply(null, args)
      .then(response => {
        if(response.error !== null) return Promise.reject(new Error(response.error.message));
        return response.data;
      })
  }
};

module.exports = request;
/*eslint-enable */

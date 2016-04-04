const Sessions = require('../models/sessions');
const db = require('./db');
const generateResponse = (promise, res) => {
  promise
    .then(data => {
      return {
        data,
        error: null,
      };
    })
    .catch(error => {
      return {
        data: [],
        error: {
          code: error.statusCode,
          message: error.message,
        },
      };
    })
    .then(output => {
      res.json(output);
    });
};

const responseHandler = {
  respond: (req, res, options) => {
    const {
      getResponse,
      validateSession = () => Promise.resolve(true),
      isSecured = false,
    } = options;
    if (isSecured) {
      const securePromise = Sessions.fetchByID(req.headers['session-id']).then(session => {
        return validateSession(session).then(() => {
          return getResponse();
        })
      });
      generateResponse(securePromise, res);
    } else {
      generateResponse(getResponse(), res);
    }
  },
};

module.exports = responseHandler;

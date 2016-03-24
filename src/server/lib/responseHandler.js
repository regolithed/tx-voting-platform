const Sessions = require('../models/sessions');
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
}

const responseHandler = {
  respond: (req, res, promise, isSecured, confirmSession) => {
    let securePromise = promise;
    if (isSecured) {
      securePromise = Sessions.fetchByID(req.headers['session-id']).then(session => {
        if (confirmSession(session)) {
          return promise;
        } else {
          return Promise.reject(new Error('Invalid Session ID'));
        }
      });
    }
    generateResponse(securePromise, res);
  },
};

module.exports = responseHandler;

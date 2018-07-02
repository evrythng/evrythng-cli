const http = require('../modules/http');

module.exports = {
  about: 'Work with account Redirector.',
  firstArg: 'redirector',
  operations: {
    read: {
      execute: async () => http.get('/redirector'),
      pattern: 'redirector read',
    },
    update: {
      execute: async ([, json]) => http.put('/redirector', JSON.parse(json)),
      pattern: 'redirector update $payload',
    },
  },
};

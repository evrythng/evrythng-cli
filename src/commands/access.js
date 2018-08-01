const http = require('../modules/http');

module.exports = {
  about: 'Read actor access information.',
  firstArg: 'access',
  operations: {
    read: {
      execute: async () => http.get('/access'),
      pattern: 'read',
    },
  },
};


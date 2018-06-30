const http = require('../modules/http');

module.exports = {
  about: 'Read Operator access information',
  startsWith: 'access',
  operations: {
    read: {
      execute: async () => http.get('/access'),
      pattern: 'access read',
    },
  },
};


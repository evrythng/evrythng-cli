const http = require('../modules/http');

module.exports = {
  about: 'View rate limit information',
  firstArg: 'rate-limit',
  operations: {
    read: {
      execute: async () => http.get('/rateLimits'),
      pattern: 'rate-limit read',
    },
  },
};


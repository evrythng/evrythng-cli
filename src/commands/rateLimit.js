const http = require('../modules/http');

module.exports = {
  about: 'View rate limit information',
  firstArg: 'rate-limits',
  operations: {
    read: {
      execute: async () => http.get('/rateLimits'),
      pattern: 'read',
    },
  },
};


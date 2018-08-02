/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

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

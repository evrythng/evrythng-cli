/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const http = require('../modules/http');

module.exports = {
  about: 'Work with account Redirector.',
  firstArg: 'redirector',
  operations: {
    read: {
      execute: async () => http.get('/redirector'),
      pattern: 'read',
    },
    update: {
      execute: async ([, json]) => http.put('/redirector', JSON.parse(json)),
      pattern: 'update $payload',
    },
  },
};

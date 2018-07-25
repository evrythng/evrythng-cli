const http = require('../modules/http');
const util = require('../modules/util');

module.exports = {
  about: 'Work with user accesses.',
  firstArg: 'accesses',
  operations: {
    create: {
      execute: async ([, json]) => http.post('/accesses', JSON.parse(json)),
      pattern: 'create $payload',
    },
    list: {
      execute: async () => {
        util.requireKey('Application User');
        return http.get('/accesses');
      },
      pattern: 'list',
    },
    delete: {
      execute: async ([id]) => {
        util.requireKey('Application User');
        return http.delete(`/accesses/${id}`);
      },
      pattern: '$id delete',
    },
  },
};

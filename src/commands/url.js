const http = require('../modules/http');

module.exports = {
  about: 'Use any valid EVRYTHNG URL.',
  firstArg: 'url',
  operations: {
    postUrl: {
      execute: async ([, url, json]) => http.post(url, JSON.parse(json)),
      pattern: 'post $url $payload',
    },
    getUrl: {
      execute: async ([, url]) => http.get(url),
      pattern: 'get $url',
    },
    putUrl: {
      execute: async ([, url, json]) => http.put(url, JSON.parse(json)),
      pattern: 'put $url',
    },
    deleteUrl: {
      execute: async ([, url]) => http.delete(url),
      pattern: 'delete $url',
    },
  },
};

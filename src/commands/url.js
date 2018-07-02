const http = require('../modules/http');

module.exports = {
  about: 'Use any valid EVRYTHNG URL.',
  firstArg: 'url',
  operations: {
    postUrl: {
      execute: async ([, url, json]) => http.post(url, JSON.parse(json)),
      pattern: 'url post $url $payload',
    },
    getUrl: {
      execute: async ([, url]) => http.get(url),
      pattern: 'url get $url',
    },
    putUrl: {
      execute: async ([, url, json]) => http.put(url, JSON.parse(json)),
      pattern: 'url put $url',
    },
    deleteUrl: {
      execute: async ([, url]) => http.delete(url),
      pattern: 'url delete $url',
    },
  },
};

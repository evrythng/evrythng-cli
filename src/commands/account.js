const http = require('../modules/http');

module.exports = {
  about: 'Work with accounts and account accesses.',
  firstArg: 'accounts',
  operations: {
    listAccount: {
      execute: async () => http.get('/accounts'),
      pattern: 'list',
    },
    readAccount: {
      execute: async ([id]) => http.get(`/accounts/${id}`),
      pattern: '$id read',
    },
    updateAccount: {
      execute: async ([id, , json]) => http.put(`/accounts/${id}`, JSON.parse(json)),
      pattern: '$id update $payload',
    },

    // Account accesses
    listAccountAcccesses: {
      execute: async ([id]) => http.get(`/accounts/${id}/accesses`),
      pattern: '$id accesses list',
    },
    readAccountAcccess: {
      execute: async ([accountId, , accessId]) => {
        const url = `/accounts/${accountId}/accesses/${accessId}`;
        return http.get(url);
      },
      pattern: '$id accesses $id read',
    },
    updateAccountAcccess: {
      execute: async ([accountId, , accessId, , json]) => {
        const url = `/accounts/${accountId}/accesses/${accessId}`;
        return http.put(url, JSON.parse(json));
      },
      pattern: '$id accesses $id update $json',
    },

    // Account domains and short domains
    listAccountDomains: {
      execute: async ([id]) => http.get(`/accounts/${id}/domains`),
      pattern: '$id domains list',
    },
    listAccountShortDomains: {
      execute: async ([id]) => http.get(`/accounts/${id}/shortDomains`),
      pattern: '$id short-domains list',
    },
  },
};

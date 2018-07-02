const http = require('../modules/http');

module.exports = {
  about: 'Work with accounts and account accesses.',
  firstArg: 'account',
  operations: {
    listAccount: {
      execute: async () => http.get('/accounts'),
      pattern: 'account list',
    },
    readAccount: {
      execute: async ([id]) => http.get(`/accounts/${id}`),
      pattern: 'account $id read',
    },
    updateAccount: {
      execute: async ([id, , json]) => http.put(`/accounts/${id}`, JSON.parse(json)),
      pattern: 'account $id update $payload',
    },
    listAccountAcccesses: {
      execute: async ([id]) => http.get(`/accounts/${id}/accesses`),
      pattern: 'account $id access list',
    },
    readAccountAcccess: {
      execute: async ([accountId, , accessId]) => {
        const url = `/accounts/${accountId}/accesses/${accessId}`;
        return http.get(url);
      },
      pattern: 'account $id access $id read',
    },
    updateAccountAcccess: {
      execute: async ([accountId, , accessId, , json]) => {
        const url = `/accounts/${accountId}/accesses/${accessId}`;
        return http.put(url, JSON.parse(json));
      },
      pattern: 'account $id access $id update $json',
    },
    listAccountDomains: {
      execute: async ([id]) => http.get(`/accounts/${id}/domains`),
      pattern: 'account $id domain list',
    },
    listAccountShortDomains: {
      execute: async ([id]) => http.get(`/accounts/${id}/shortDomains`),
      pattern: 'account $id short-domain list',
    },
  },
};

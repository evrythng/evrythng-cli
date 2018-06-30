const http = require('../modules/http');
const util = require('../modules/util');

module.exports = {
  about: 'Work with Application User resources.',
  startsWith: 'app-user',
  operations: {
    createApplicationUser: {
      execute: async ([, json]) => {
        util.requireKey('Application');

        const payload = await util.buildPayload('ApplicationUserDocument', json);
        return http.post('/auth/evrythng/users', payload);
      },
      pattern: 'app-user create $payload',
    },
    validateApplicationUser: {
      execute: async ([id, , json]) => {
        util.requireKey('Application');

        const payload = await util.buildPayload('ActivationCodeDocument', json);
        return http.post(`/auth/evrythng/users/${id}/validate`, payload);
      },
      pattern: 'app-user $id validate $payload',
    },
    createAnonymousApplicationUser: {
      execute: async () => {
        util.requireKey('Application');

        const payload = { anonymous: true };
        return http.post('/auth/evrythng/users?anonymous=true', payload);
      },
      pattern: 'app-user anonymous create',
    },
    readApplicationUser: {
      execute: async ([id]) => http.get(`/users/${id}`),
      pattern: 'app-user $id read',
    },
    listApplicationUsers: {
      execute: async () => http.get('/users'),
      pattern: 'app-user list',
    },
    updateApplicationUser: {
      execute: async ([id, , json]) => {
        const payload = await util.buildPayload('ApplicationUserDocument', json);
        return http.put(`/users/${id}`, payload);
      },
      pattern: 'app-user $id update $payload',
    },
    deleteApplicationUser: {
      execute: async ([id]) => http.delete(`/users/${id}`),
      pattern: 'app-user $id delete',
    },
    logInApplicationUser: {
      execute: async ([, json]) => {
        util.requireKey('Application');
        return http.post('/users/login', JSON.parse(json));
      },
      pattern: 'app-user login $payload',
    },
    logOutApplicationUser: {
      execute: async () => {
        util.requireKey('Application User');
        return http.post('/auth/all/logout');
      },
      pattern: 'app-user logout',
    },
  },
};

const http = require('../modules/http');

module.exports = {
  about: 'Work with role and permission resources.',
  firstArg: 'roles',
  operations: {
    // CRUD - roles
    createRole: {
      execute: async ([, json]) => http.post('/roles', JSON.parse(json)),
      pattern: 'create $payload',
    },
    readRole: {
      execute: async ([roleId]) => http.get(`/roles/${roleId}`),
      pattern: '$id read',
    },
    listRole: {
      execute: async () => http.get('/roles'),
      pattern: 'list',
    },
    updateRole: {
      execute: async ([roleId, , json]) => http.put(`/roles/${roleId}`, JSON.parse(json)),
      pattern: '$id update $payload',
    },
    deleteRole: {
      execute: async ([roleId]) => http.delete(`/roles/${roleId}`),
      pattern: '$id delete',
    },

    // Role permissions
    listPermissions: {
      execute: async ([roleId]) => http.get(`/roles/${roleId}/permissions`),
      pattern: '$id permissions list',
    },
    updatePermissions: {
      execute: async ([roleId, , , json]) => {
        const url = `/roles/${roleId}/permissions`;
        return http.put(url, JSON.parse(json));
      },
      pattern: '$id permissions update $payload',
    },
  },
};

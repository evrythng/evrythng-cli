const http = require('../modules/http');

module.exports = {
  about: 'Work with role and permission resources.',
  startsWith: 'role',
  operations: {
    // CRUD - roles
    createRole: {
      execute: async ([, json]) => http.post('/roles', JSON.parse(json)),
      pattern: 'role create $payload',
    },
    readRole: {
      execute: async ([roleId]) => http.get(`/roles/${roleId}`),
      pattern: 'role $id read',
    },
    listRole: {
      execute: async () => http.get('/roles'),
      pattern: 'role list',
    },
    updateRole: {
      execute: async ([roleId, , json]) => http.put(`/roles/${roleId}`, JSON.parse(json)),
      pattern: 'role $id update $payload',
    },
    deleteRole: {
      execute: async ([roleId]) => http.delete(`/roles/${roleId}`),
      pattern: 'role $id delete',
    },

    // Role permissions
    listPermissions: {
      execute: async ([roleId]) => http.get(`/roles/${roleId}/permissions`),
      pattern: 'role $id permission list',
    },
    updatePermissions: {
      execute: async ([roleId, , , json]) => {
        const url = `/roles/${roleId}/permissions`;
        return http.put(url, JSON.parse(json));
      },
      pattern: 'role $id permission update $payload',
    },
  },
};

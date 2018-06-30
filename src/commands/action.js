const http = require('../modules/http');
const util = require('../modules/util');

module.exports = {
  about: 'Work with actions.',
  startsWith: 'action',
  operations: {
    createAction: {
      execute: async ([type, , json]) => {
        const payload = await util.buildPayload('ActionDocument', json);
        return http.post(`/actions/${type}`, payload);
      },
      pattern: 'action $type create $payload',
    },
    listActions: {
      execute: async ([type]) => http.get(`/actions/${type}`),
      pattern: 'action $type list',
    },
    readAction: {
      execute: async ([type, id]) => http.get(`/actions/${type}/${id}`),
      pattern: 'action $type $id read',
    },
    deleteAction: {
      execute: async ([type, id]) => http.delete(`/actions/${type}/${id}`),
      pattern: 'action $type $id delete',
    },
  },
};

const http = require('../modules/http');
const util = require('../modules/util');

module.exports = {
  about: 'Work with action types.',
  startsWith: 'action-type',
  operations: {
    createActionType: {
      execute: async ([, json]) => {
        const payload = await util.buildPayload('ActionTypeDocument', json);
        return http.post('/actions', payload);
      },
      pattern: 'action-type create $payload',
    },
    listActionType: {
      execute: async () => http.get('/actions'),
      pattern: 'action-type list',
    },
    updateActionType: {
      execute: async ([type, , json]) => {
        const payload = await util.buildPayload('ActionTypeDocument', json);
        return http.put(`/actions/${type}`, payload);
      },
      pattern: 'action-type $type update $payload',
    },
    deleteActionType: {
      execute: async ([type]) => http.delete(`/actions/${type}`),
      pattern: 'action-type $type delete',
    },
  },
};

const http = require('../modules/http');
const util = require('../modules/util');

module.exports = {
  about: 'Work with action types.',
  firstArg: 'action-type',
  operations: {
    createActionType: {
      execute: async ([, json]) => {
        const payload = await util.getPayload('ActionTypeDocument', json);
        return http.post('/actions', payload);
      },
      pattern: 'action-type create $payload',
    },
    listActionType: {
      execute: async () => http.get('/actions'),
      pattern: 'action-type list',
    },
    updateActionType: {
      execute: async ([type, , json]) => http.put(`/actions/${type}`, JSON.parse(json)),
      pattern: 'action-type $type update $payload',
    },
    deleteActionType: {
      execute: async ([type]) => http.delete(`/actions/${type}`),
      pattern: 'action-type $type delete',
    },
  },
};

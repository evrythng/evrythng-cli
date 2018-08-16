/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const http = require('../modules/http');
const util = require('../modules/util');

module.exports = {
  about: 'Work with action types.',
  firstArg: 'action-types',
  operations: {
    createActionType: {
      execute: async ([, json]) => {
        const payload = await util.getPayload('ActionTypeDocument', json);
        return http.post('/actions', payload);
      },
      pattern: 'create $payload',
      buildable: true,
    },
    listActionType: {
      execute: async () => http.get('/actions'),
      pattern: 'list',
    },
    updateActionType: {
      execute: async ([type, , json]) => http.put(`/actions/${type}`, JSON.parse(json)),
      pattern: '$type update $payload',
    },
    deleteActionType: {
      execute: async ([type]) => http.delete(`/actions/${type}`),
      pattern: '$type delete',
    },
  },
};

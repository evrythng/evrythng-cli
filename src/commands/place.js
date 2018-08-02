/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const http = require('../modules/http');
const util = require('../modules/util');

module.exports = {
  about: 'Work with place resources.',
  firstArg: 'places',
  operations: {
    create: {
      execute: async ([, json]) => {
        const payload = await util.getPayload('PlaceDocument', json);
        return http.post('/places', payload);
      },
      pattern: 'create $payload',
    },
    read: {
      execute: async ([placeId]) => http.get(`/places/${placeId}`),
      pattern: '$id read',
    },
    list: {
      execute: async () => http.get('/places'),
      pattern: 'list',
    },
    update: {
      execute: async ([placeId, , json]) => http.put(`/places/${placeId}`, JSON.parse(json)),
      pattern: '$id update $payload',
    },
    delete: {
      execute: async ([placeId]) => http.delete(`/places/${placeId}`),
      pattern: '$id delete',
    },
  },
};

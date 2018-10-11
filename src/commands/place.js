/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const csv = require('../modules/csv');
const http = require('../modules/http');
const switches = require('../modules/switches');
const util = require('../modules/util');

module.exports = {
  about: 'Work with place resources.',
  firstArg: 'places',
  operations: {
    create: {
      execute: async ([, json]) => {
        if (switches.FROM_CSV) {
          return csv.read('place');
        }

        const payload = await util.getPayload('PlaceDocument', json);
        return http.post('/places', payload);
      },
      pattern: 'create $payload',
      buildable: true,
      importable: true,
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

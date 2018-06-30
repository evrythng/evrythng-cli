const http = require('../modules/http');
const util = require('../modules/util');

module.exports = {
  about: 'Work with place resources.',
  startsWith: 'place',
  operations: {
    create: {
      execute: async ([, json]) => {
        const payload = await util.buildPayload('PlaceDocument', json);
        return http.post('/places', payload);
      },
      pattern: 'place create $payload',
    },
    read: {
      execute: async ([placeId]) => http.get(`/places/${placeId}`),
      pattern: 'place $id read',
    },
    list: {
      execute: async () => http.get('/places'),
      pattern: 'place list',
    },
    update: {
      execute: async ([placeId, , json]) => {
        const payload = await util.buildPayload('PlaceDocument', json);
        return http.put(`/places/${placeId}`, payload);
      },
      pattern: 'place $id update $payload',
    },
    delete: {
      execute: async ([placeId]) => http.delete(`/places/${placeId}`),
      pattern: 'place $id delete',
    },
  },
};

const http = require('../modules/http');
const util = require('../modules/util');

module.exports = {
  about: 'Work with Thng resources.',
  startsWith: 'thng',
  operations: {
    // CRUD
    createThng: {
      execute: async ([, json]) => {
        const payload = await util.buildPayload('ThngDocument', json);
        return http.post('/thngs', payload);
      },
      pattern: 'thng create $payload',
    },
    readThng: {
      execute: async ([id]) => http.get(`/thngs/${id}`),
      pattern: 'thng $id read',
    },
    listThng: {
      execute: async () => http.get('/thngs'),
      pattern: 'thng list',
    },
    updateThng: {
      execute: async ([id, , json]) => http.put(`/thngs/${id}`, JSON.parse(json)),
      pattern: 'thng $id update $payload',
    },
    deleteThng: {
      execute: async ([id]) => http.delete(`/thngs/${id}`),
      pattern: 'thng $id delete',
    },

    // Thng properties
    createProperty: {
      execute: async ([id, , , json]) => http.put(`/thngs/${id}/properties`, JSON.parse(json)),
      pattern: 'thng $id property create $payload',
    },
    listProperties: {
      execute: async ([id]) => http.get(`/thngs/${id}/properties`),
      pattern: 'thng $id property list',
    },
    readProperty: {
      execute: async ([id, , key]) => http.get(`/thngs/${id}/properties/${key}`),
      pattern: 'thng $id property $key read',
    },
    updateProperty: {
      execute: async ([id, , key, , json]) => {
        const url = `/thngs/${id}/properties/${key}`;
        return http.put(url, JSON.parse(json));
      },
      pattern: 'thng $id property $key update $payload',
    },
    deleteProperty: {
      execute: async ([id, , key]) => http.delete(`/thngs/${id}/properties/${key}`),
      pattern: 'thng $id property $key delete',
    },

    // Thng actions
    createThngAction: {
      execute: async ([id, , , json]) => {
        const payload = JSON.parse(json);
        return http.post(`/thngs/${id}/actions/all`, payload);
      },
      pattern: 'thng $id action create $payload',
    },
    listThngActions: {
      execute: async ([id]) => http.get(`/thngs/${id}/actions/all`),
      pattern: 'thng $id action list',
    },
    readThngAction: {
      execute: async ([thngId, , actionId]) => {
        const url = `/thngs/${thngId}/actions/all/${actionId}`;
        return http.get(url);
      },
      pattern: 'thng $id action $id read',
    },

    // Thng redirection
    createThngRedirection: {
      execute: async ([id, , , json]) => http.post(`/thngs/${id}/redirector`, JSON.parse(json)),
      pattern: 'thng $id redirection create $payload',
    },
    readThngRedirection: {
      execute: async ([id]) => http.get(`/thngs/${id}/redirector`),
      pattern: 'thng $id redirection read',
    },
    updateThngRedirection: {
      execute: async ([id, , , json]) => http.put(`/thngs/${id}/redirector`, JSON.parse(json)),
      pattern: 'thng $id redirection update $payload',
    },
    deleteThngRedirection: {
      execute: async ([id]) => http.delete(`/thngs/${id}/redirector`),
      pattern: 'thng $id redirection delete',
    },

    // Thng location
    readThngLocation: {
      execute: async ([id]) => http.get(`/thngs/${id}/location`),
      pattern: 'thng $id location read',
    },
    updateThngLocation: {
      execute: async ([id, , , json]) => http.put(`/thngs/${id}/location`, JSON.parse(json)),
      pattern: 'thng $id location update $payload',
    },
    deleteThngLocation: {
      execute: async ([id]) => http.delete(`/thngs/${id}/location`),
      pattern: 'thng $id location delete',
    },

    // Device API Key
    createThngDeviceKey: {
      execute: async ([, , json]) => http.post('/auth/evrythng/thngs', JSON.parse(json)),
      pattern: 'thng device-key create $payload',
    },
    readThngDeviceKey: {
      execute: async ([id]) => http.get(`/auth/evrythng/thngs/${id}`),
      pattern: 'thng $id device-key read',
    },
    deleteThngDeviceKey: {
      execute: async ([id]) => http.delete(`/auth/evrythng/thngs/${id}`),
      pattern: 'thng $id device-key delete',
    },
  },
};

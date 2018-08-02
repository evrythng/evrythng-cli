/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const http = require('../modules/http');
const util = require('../modules/util');

module.exports = {
  about: 'Work with Thng resources.',
  firstArg: 'thngs',
  operations: {
    // CRUD
    createThng: {
      execute: async ([, json]) => {
        const payload = await util.getPayload('ThngDocument', json);
        return http.post('/thngs', payload);
      },
      pattern: 'create $payload',
    },
    readThng: {
      execute: async ([id]) => http.get(`/thngs/${id}`),
      pattern: '$id read',
    },
    listThng: {
      execute: async () => http.get('/thngs'),
      pattern: 'list',
    },
    updateThng: {
      execute: async ([id, , json]) => http.put(`/thngs/${id}`, JSON.parse(json)),
      pattern: '$id update $payload',
    },
    deleteThng: {
      execute: async ([id]) => http.delete(`/thngs/${id}`),
      pattern: '$id delete',
    },

    // Thng properties
    createProperty: {
      execute: async ([id, , , json]) => http.put(`/thngs/${id}/properties`, JSON.parse(json)),
      pattern: '$id properties create $payload',
    },
    listProperties: {
      execute: async ([id]) => http.get(`/thngs/${id}/properties`),
      pattern: '$id properties list',
    },
    readProperty: {
      execute: async ([id, , key]) => http.get(`/thngs/${id}/properties/${key}`),
      pattern: '$id properties $key read',
    },
    updateProperty: {
      execute: async ([id, , key, , json]) => {
        const url = `/thngs/${id}/properties/${key}`;
        return http.put(url, JSON.parse(json));
      },
      pattern: '$id properties $key update $payload',
    },
    deleteProperty: {
      execute: async ([id, , key]) => http.delete(`/thngs/${id}/properties/${key}`),
      pattern: '$id properties $key delete',
    },

    // Thng actions
    createThngAction: {
      execute: async ([id, , , json]) => {
        const payload = JSON.parse(json);
        return http.post(`/thngs/${id}/actions/all`, payload);
      },
      pattern: '$id actions create $payload',
    },
    listThngActions: {
      execute: async ([id]) => http.get(`/thngs/${id}/actions/all`),
      pattern: '$id actions list',
    },
    readThngAction: {
      execute: async ([thngId, , actionId]) => {
        const url = `/thngs/${thngId}/actions/all/${actionId}`;
        return http.get(url);
      },
      pattern: '$id actions $id read',
    },

    // Thng redirection
    createThngRedirection: {
      execute: async ([id, , , json]) => http.post(`/thngs/${id}/redirector`, JSON.parse(json)),
      pattern: '$id redirection create $payload',
    },
    readThngRedirection: {
      execute: async ([id]) => http.get(`/thngs/${id}/redirector`),
      pattern: '$id redirection read',
    },
    updateThngRedirection: {
      execute: async ([id, , , json]) => http.put(`/thngs/${id}/redirector`, JSON.parse(json)),
      pattern: '$id redirection update $payload',
    },
    deleteThngRedirection: {
      execute: async ([id]) => http.delete(`/thngs/${id}/redirector`),
      pattern: '$id redirection delete',
    },

    // Thng location
    readThngLocation: {
      execute: async ([id]) => http.get(`/thngs/${id}/location`),
      pattern: '$id location read',
    },
    updateThngLocation: {
      execute: async ([id, , , json]) => http.put(`/thngs/${id}/location`, JSON.parse(json)),
      pattern: '$id location update $payload',
    },
    deleteThngLocation: {
      execute: async ([id]) => http.delete(`/thngs/${id}/location`),
      pattern: '$id location delete',
    },

    // Device API Key
    createThngDeviceKey: {
      execute: async ([, , json]) => http.post('/auth/evrythng/thngs', JSON.parse(json)),
      pattern: 'device-key create $payload',
    },
    readThngDeviceKey: {
      execute: async ([id]) => http.get(`/auth/evrythng/thngs/${id}`),
      pattern: '$id device-key read',
    },
    deleteThngDeviceKey: {
      execute: async ([id]) => http.delete(`/auth/evrythng/thngs/${id}`),
      pattern: '$id device-key delete',
    },
  },
};

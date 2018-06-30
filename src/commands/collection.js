const http = require('../modules/http');
const util = require('../modules/util');

module.exports = {
  about: 'Work with collection resources.',
  startsWith: 'collection',
  operations: {
    // CRUD
    createCollection: {
      execute: async ([, json]) => {
        const payload = await util.buildPayload('CollectionDocument', json);
        return http.post('/collections', payload);
      },
      pattern: 'collection create $payload',
    },
    readCollection: {
      execute: async ([id]) => http.get(`/collections/${id}`),
      pattern: 'collection $id read',
    },
    listCollection: {
      execute: async () => http.get('/collections'),
      pattern: 'collection list',
    },
    updateCollection: {
      execute: async ([id, , json]) => {
        const payload = await util.buildPayload('CollectionDocument', json);
        return http.put(`/collections/${id}`, payload);
      },
      pattern: 'collection $id update $payload',
    },
    deleteCollection: {
      execute: async ([id]) => http.delete(`/collections/${id}`),
      pattern: 'collection $id delete',
    },

    // Collection actions
    createCollectionAction: {
      execute: async ([id, , , json]) => {
        const payload = JSON.parse(json);
        return http.post(`/collections/${id}/actions/all`, payload);
      },
      pattern: 'collection $id action create $payload',
    },
    listCollectionActions: {
      execute: async ([id]) => http.get(`/collections/${id}/actions/all`),
      pattern: 'collection $id action list',
    },
    readCollectionAction: {
      execute: async ([collectionId, , actionId]) => {
        const url = `/collections/${collectionId}/actions/all/${actionId}`;
        return http.get(url);
      },
      pattern: 'collection $id action $id read',
    },

    // Collection collections
    addCollectionCollections: {
      execute: async ([id, , , json]) => {
        const url = `/collections/${id}/collections`;
        return http.post(url, JSON.parse(json));
      },
      pattern: 'collection $id collection add $payload',
    },
    listCollectionCollections: {
      execute: async ([id]) => http.get(`/collections/${id}/collections`),
      pattern: 'collection $id collection list',
    },
    deleteCollectionCollection: {
      execute: async ([parentId, , childId]) => {
        const url = `/collections/${parentId}/collections/${childId}`;
        return http.delete(url);
      },
      pattern: 'collection $id collection $id delete',
    },
    deleteCollectionCollections: {
      execute: async ([id]) => {
        const url = `/collections/${id}/collections`;
        return http.delete(url);
      },
      pattern: 'collection $id collection delete',
    },

    // Collection Thngs
    addCollectionThngs: {
      execute: async ([id, , , json]) => http.put(`/collections/${id}/thngs`, JSON.parse(json)),
      pattern: 'collection $id thng add $payload',
    },
    listCollectionThngs: {
      execute: async ([id]) => http.get(`/collections/${id}/thngs`),
      pattern: 'collection $id thng list',
    },
    deleteCollectionThng: {
      execute: async ([collectionId, , thngId]) => {
        const url = `/collections/${collectionId}/thngs/${thngId}`;
        return http.delete(url);
      },
      pattern: 'collection $id thng $id delete',
    },
    deleteCollectionThngs: {
      execute: async ([id]) => {
        const url = `/collections/${id}/thngs`;
        return http.delete(url);
      },
      pattern: 'collection $id thng delete',
    },
  },
};

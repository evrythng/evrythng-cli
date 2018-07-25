const http = require('../modules/http');
const util = require('../modules/util');

module.exports = {
  about: 'Work with collection resources.',
  firstArg: 'collections',
  operations: {
    // CRUD
    createCollection: {
      execute: async ([, json]) => {
        const payload = await util.getPayload('CollectionDocument', json);
        return http.post('/collections', payload);
      },
      pattern: 'create $payload',
    },
    readCollection: {
      execute: async ([id]) => http.get(`/collections/${id}`),
      pattern: '$id read',
    },
    listCollection: {
      execute: async () => http.get('/collections'),
      pattern: 'list',
    },
    updateCollection: {
      execute: async ([id, , json]) => http.put(`/collections/${id}`, JSON.parse(json)),
      pattern: '$id update $payload',
    },
    deleteCollection: {
      execute: async ([id]) => http.delete(`/collections/${id}`),
      pattern: '$id delete',
    },

    // Collection actions
    createCollectionAction: {
      execute: async ([id, , , json]) => {
        const payload = JSON.parse(json);
        return http.post(`/collections/${id}/actions/all`, payload);
      },
      pattern: '$id actions create $payload',
    },
    listCollectionActions: {
      execute: async ([id]) => http.get(`/collections/${id}/actions/all`),
      pattern: '$id actions list',
    },
    readCollectionAction: {
      execute: async ([collectionId, , actionId]) => {
        const url = `/collections/${collectionId}/actions/all/${actionId}`;
        return http.get(url);
      },
      pattern: '$id actions $id read',
    },

    // Collection collections
    addCollectionCollections: {
      execute: async ([id, , , json]) => {
        const url = `/collections/${id}/collections`;
        return http.post(url, JSON.parse(json));
      },
      pattern: '$id collections add $payload',
    },
    listCollectionCollections: {
      execute: async ([id]) => http.get(`/collections/${id}/collections`),
      pattern: '$id collections list',
    },
    deleteCollectionCollection: {
      execute: async ([parentId, , childId]) => {
        const url = `/collections/${parentId}/collections/${childId}`;
        return http.delete(url);
      },
      pattern: '$id collections $id delete',
    },
    deleteCollectionCollections: {
      execute: async ([id]) => {
        const url = `/collections/${id}/collections`;
        return http.delete(url);
      },
      pattern: '$id collections delete',
    },

    // Collection Thngs
    addCollectionThngs: {
      execute: async ([id, , , json]) => http.put(`/collections/${id}/thngs`, JSON.parse(json)),
      pattern: '$id thngs add $payload',
    },
    listCollectionThngs: {
      execute: async ([id]) => http.get(`/collections/${id}/thngs`),
      pattern: '$id thngs list',
    },
    deleteCollectionThng: {
      execute: async ([collectionId, , thngId]) => {
        const url = `/collections/${collectionId}/thngs/${thngId}`;
        return http.delete(url);
      },
      pattern: '$id thngs $id delete',
    },
    deleteCollectionThngs: {
      execute: async ([id]) => {
        const url = `/collections/${id}/thngs`;
        return http.delete(url);
      },
      pattern: '$id thngs delete',
    },
  },
};

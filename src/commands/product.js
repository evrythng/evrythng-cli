const http = require('../modules/http');
const util = require('../modules/util');

module.exports = {
  about: 'Work with product resources.',
  firstArg: 'products',
  operations: {
    // CRUD
    createProduct: {
      execute: async ([, json]) => {
        const payload = await util.getPayload('ProductDocument', json);
        return http.post('/products', payload);
      },
      pattern: 'create $payload',
    },
    readProduct: {
      execute: async ([id]) => http.get(`/products/${id}`),
      pattern: '$id read',
    },
    listProduct: {
      execute: async () => http.get('/products'),
      pattern: 'list',
    },
    updateProduct: {
      execute: async ([id, , json]) => http.put(`/products/${id}`, JSON.parse(json)),
      pattern: '$id update $payload',
    },
    deleteProduct: {
      execute: async ([id]) => http.delete(`/products/${id}`),
      pattern: '$id delete',
    },

    // Product properties
    createProperty: {
      execute: async ([id, , , json]) => http.put(`/products/${id}/properties`, JSON.parse(json)),
      pattern: '$id properties create $payload',
    },
    listProperties: {
      execute: async ([id]) => http.get(`/products/${id}/properties`),
      pattern: '$id properties list',
    },
    readProperty: {
      execute: async ([id, , key]) => http.get(`/products/${id}/properties/${key}`),
      pattern: '$id properties $key read',
    },
    updateProperty: {
      execute: async ([id, , key, , json]) => {
        const url = `/products/${id}/properties/${key}`;
        return http.put(url, JSON.parse(json));
      },
      pattern: '$id properties $key update $payload',
    },
    deleteProperty: {
      execute: async ([id, , key]) => http.delete(`/products/${id}/properties/${key}`),
      pattern: '$id properties $key delete',
    },

    // Product actions
    createProductAction: {
      execute: async ([id, , , json]) => {
        const payload = JSON.parse(json);
        return http.post(`/products/${id}/actions/all`, payload);
      },
      pattern: '$id actions create $payload',
    },
    listProductActions: {
      execute: async ([id]) => http.get(`/products/${id}/actions/all`),
      pattern: '$id actions list',
    },
    readProductAction: {
      execute: async ([productId, , actionId]) => {
        const url = `/products/${productId}/actions/all/${actionId}`;
        return http.get(url);
      },
      pattern: '$id actions $id read',
    },

    // Product redirection
    createProductRedirection: {
      execute: async ([id, , , json]) => http.post(`/products/${id}/redirector`, JSON.parse(json)),
      pattern: '$id redirection create $payload',
    },
    readProductRedirection: {
      execute: async ([id]) => http.get(`/products/${id}/redirector`),
      pattern: '$id redirection read',
    },
    updateProductRedirection: {
      execute: async ([id, , , json]) => http.put(`/products/${id}/redirector`, JSON.parse(json)),
      pattern: '$id redirection update $payload',
    },
    deleteProductRedirection: {
      execute: async ([id]) => http.delete(`/products/${id}/redirector`),
      pattern: '$id redirection delete',
    },
  },
};

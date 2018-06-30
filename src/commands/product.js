const http = require('../modules/http');
const util = require('../modules/util');

module.exports = {
  about: 'Work with product resources.',
  startsWith: 'product',
  operations: {
    // CRUD
    createProduct: {
      execute: async ([, json]) => {
        const payload = await util.buildPayload('ProductDocument', json);
        return http.post('/products', payload);
      },
      pattern: 'product create $payload',
    },
    readProduct: {
      execute: async ([id]) => http.get(`/products/${id}`),
      pattern: 'product $id read',
    },
    listProduct: {
      execute: async () => http.get('/products'),
      pattern: 'product list',
    },
    updateProduct: {
      execute: async ([id, , json]) => http.put(`/products/${id}`, JSON.parse(json)),
      pattern: 'product $id update $payload',
    },
    deleteProduct: {
      execute: async ([id]) => http.delete(`/products/${id}`),
      pattern: 'product $id delete',
    },

    // Product properties
    createProperty: {
      execute: async ([id, , , json]) => http.put(`/products/${id}/properties`, JSON.parse(json)),
      pattern: 'product $id property create $payload',
    },
    listProperties: {
      execute: async ([id]) => http.get(`/products/${id}/properties`),
      pattern: 'product $id property list',
    },
    readProperty: {
      execute: async ([id, , key]) => http.get(`/products/${id}/properties/${key}`),
      pattern: 'product $id property $key read',
    },
    updateProperty: {
      execute: async ([id, , key, , json]) => {
        const url = `/products/${id}/properties/${key}`;
        return http.put(url, JSON.parse(json));
      },
      pattern: 'product $id property $key update $payload',
    },
    deleteProperty: {
      execute: async ([id, , key]) => http.delete(`/products/${id}/properties/${key}`),
      pattern: 'product $id property $key delete',
    },

    // Product actions
    createProductAction: {
      execute: async ([id, , , json]) => {
        const payload = JSON.parse(json);
        return http.post(`/products/${id}/actions/all`, payload);
      },
      pattern: 'product $id action create $payload',
    },
    listProductActions: {
      execute: async ([id]) => http.get(`/products/${id}/actions/all`),
      pattern: 'product $id action list',
    },
    readProductAction: {
      execute: async ([productId, , actionId]) => {
        const url = `/products/${productId}/actions/all/${actionId}`;
        return http.get(url);
      },
      pattern: 'product $id action $id read',
    },

    // Product redirection
    createProductRedirection: {
      execute: async ([id, , , json]) => http.post(`/products/${id}/redirector`, JSON.parse(json)),
      pattern: 'product $id redirection create $payload',
    },
    readProductRedirection: {
      execute: async ([id]) => http.get(`/products/${id}/redirector`),
      pattern: 'product $id redirection read',
    },
    updateProductRedirection: {
      execute: async ([id, , , json]) => http.put(`/products/${id}/redirector`, JSON.parse(json)),
      pattern: 'product $id redirection update $payload',
    },
    deleteProductRedirection: {
      execute: async ([id]) => http.delete(`/products/${id}/redirector`),
      pattern: 'product $id redirection delete',
    },
  },
};

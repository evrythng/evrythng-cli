/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const http = require('../modules/http');
const util = require('../modules/util');

module.exports = {
  about: 'Work with ADI orders.',
  firstArg: 'adi-orders',
  operations: {
    createAdiOrder: {
      execute: async ([, json]) => http.post('/adis/orders', JSON.parse(json)),
      pattern: 'create $payload',
      helpPattern: 'create $payload',
    },
    readAdiOrder: {
      execute: async ([id]) => http.get(`/adis/orders/${id}`),
      pattern: '$id read',
    },

    createAdiOrderEvent: {
      execute: async ([id, , , json]) => http.post(`/adis/orders/${id}/events`, JSON.parse(json)),
      pattern: '$id events create $payload',
      helpPattern: '$id events create $payload',
    },
  },
};

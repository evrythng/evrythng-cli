const http = require('../modules/http');
const util = require('../modules/util');

module.exports = {
  about: 'Work with batches.',
  firstArg: 'batches',
  operations: {
    createBatch: {
      execute: async ([, json]) => {
        const payload = await util.getPayload('BatchDocument', json);
        return http.post('/batches', payload);
      },
      pattern: 'create $payload',
    },
    readBatch: {
      execute: async ([id]) => http.get(`/batches/${id}`),
      pattern: '$id read',
    },
    listBatch: {
      execute: async () => http.get('/batches'),
      pattern: 'list',
    },
    updateBatch: {
      execute: async ([id, , json]) => http.put(`/batches/${id}`, JSON.parse(json)),
      pattern: '$id update $payload',
    },
    deleteBatch: {
      execute: async ([id]) => http.delete(`/batches/${id}`),
      pattern: '$id delete',
    },
    createTask: {
      execute: async ([id, , , json]) => {
        const payload = await util.getPayload('task', json);
        return http.post(`/batches/${id}/tasks`, payload);
      },
      pattern: '$id tasks create $payload',
    },
    listTasks: {
      execute: async ([id]) => http.get(`/batches/${id}/tasks`),
      pattern: '$id tasks list',
    },
    readTask: {
      execute: async ([batchId, , taskId]) => http.get(`/batches/${batchId}/tasks/${taskId}`),
      pattern: '$id tasks $id read',
    },
    readTaskLogs: {
      execute: async ([batchId, , taskId]) => http.get(`/batches/${batchId}/tasks/${taskId}/logs`),
      pattern: '$id tasks $id logs list',
    },
  },
};

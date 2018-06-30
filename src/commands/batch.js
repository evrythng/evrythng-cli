const http = require('../modules/http');
const util = require('../modules/util');

module.exports = {
  about: 'Work with batches.',
  startsWith: 'batch',
  operations: {
    createBatch: {
      execute: async ([, json]) => {
        const payload = await util.buildPayload('BatchDocument', json);
        return http.post('/batches', payload);
      },
      pattern: 'batch create $payload',
    },
    readBatch: {
      execute: async ([id]) => http.get(`/batches/${id}`),
      pattern: 'batch $id read',
    },
    listBatch: {
      execute: async () => http.get('/batches'),
      pattern: 'batch list',
    },
    updateBatch: {
      execute: async ([id, , json]) => {
        const payload = await util.buildPayload('BatchDocument', json);
        return http.put(`/batches/${id}`, payload);
      },
      pattern: 'batch $id update $payload',
    },
    deleteBatch: {
      execute: async ([id]) => http.delete(`/batches/${id}`),
      pattern: 'batch $id delete',
    },
    createTask: {
      execute: async ([id, , , json]) => http.post(`/batches/${id}/tasks`, JSON.parse(json)),
      pattern: 'batch $id task create $payload',
    },
    listTasks: {
      execute: async ([id]) => http.get(`/batches/${id}/tasks`),
      pattern: 'batch $id task list',
    },
    readTask: {
      execute: async ([batchId, , taskId]) => http.get(`/batches/${batchId}/tasks/${taskId}`),
      pattern: 'batch $id task $id read',
    },
    readTaskLogs: {
      execute: async ([batchId, , taskId]) => http.get(`/batches/${batchId}/tasks/${taskId}/logs`),
      pattern: 'batch $id task $id logs list',
    },
  },
};

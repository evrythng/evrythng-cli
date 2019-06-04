/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { ID, mockApi } = require('../util');
const cli = require('../../src/functions/cli');

describe('batches', async () => {
  it('should make correct request for \'batches create $payload\'', async () => {
    const payload = JSON.stringify({ name: 'Test batch' });
    mockApi()
      .post('/batches', payload)
      .reply(201);

    await cli(`batches create ${payload}`);
  });

  it('should make correct request for \'batches list\'', async () => {
    mockApi()
      .get('/batches?perPage=30')
      .reply(200);

    await cli('batches list');
  });

  it('should make correct request for \'batches $id read\'', async () => {
    mockApi()
      .get(`/batches/${ID}`)
      .reply(200);

    await cli(`batches ${ID} read`);
  });

  it('should make correct request for \'batches $id update $payload\'', async () => {
    const payload = JSON.stringify({ description: 'Updated description' });
    mockApi()
      .put(`/batches/${ID}`, payload)
      .reply(200);

    await cli(`batches ${ID} update ${payload}`);
  });

  it('should make correct request for \'batches $id tasks create $payload\'', async () => {
    const payload = JSON.stringify({
      type: 'SHORT_ID_GENERATION',
      inputParameters: {
        quantity: 10,
        shortIdTemplate: {
          type: 'PSEUDO_RANDOM',
          length: 32,
          prefix: 'HF',
          suffix: '2113',
          separator: '-',
        },
      },
    });
    mockApi()
      .post(`/batches/${ID}/tasks`, payload)
      .reply(202);

    await cli(`batches ${ID} tasks create ${payload}`);
  });

  it('should make correct request for \'batches $id tasks list\'', async () => {
    mockApi()
      .get(`/batches/${ID}/tasks?perPage=30`)
      .reply(200);

    await cli(`batches ${ID} tasks list`);
  });

  it('should make correct request for \'batches $id tasks $id read\'', async () => {
    mockApi()
      .get(`/batches/${ID}/tasks/${ID}`)
      .reply(200);

    await cli(`batches ${ID} tasks ${ID} read`);
  });

  it('should make correct request for \'batches $id tasks $id logs list\'', async () => {
    mockApi()
      .get(`/batches/${ID}/tasks/${ID}/logs?perPage=30`)
      .reply(200);

    await cli(`batches ${ID} tasks ${ID} logs list`);
  });

  it('should make correct request for \'batches $id delete\'', async () => {
    mockApi()
      .delete(`/batches/${ID}`)
      .reply(200);

    await cli(`batches ${ID} delete`);
  });
});

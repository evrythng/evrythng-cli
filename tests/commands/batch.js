/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { expect } = require('chai');
const { ctx } = require('../modules/util');
const cli = require('../../src/functions/cli');

const readTasks = async () => cli(`batches ${ctx.batchId} tasks list`);

const waitForTaskCompletion = async () => {
  let res = await readTasks();
  while (res.data[0].status !== 'EXECUTED') res = await readTasks();
};

describe('batches', async () => {
  it('should return 201 for \'batches create $payload\'', async () => {
    const payload = JSON.stringify({ name: 'Test batch' });
    const res = await cli(`batches create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.batchId = res.data.id;
  });

  it('should return 200 for \'batches list\'', async () => {
    const res = await cli('batches list');

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'batches $id read\'', async () => {
    const res = await cli(`batches ${ctx.batchId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'batches $id update $payload\'', async () => {
    const payload = JSON.stringify({ description: 'Updated description' });
    const res = await cli(`batches ${ctx.batchId} update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 202 for \'batches $id tasks create $payload\'', async () => {
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
    const res = await cli(`batches ${ctx.batchId} tasks create ${payload}`);

    expect(res.status).to.equal(202);

    await waitForTaskCompletion();
  });

  it('should return 200 for \'batches $id tasks list\'', async () => {
    const res = await cli(`batches ${ctx.batchId} tasks list`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');

    ctx.taskId = res.data[0].id;
  });

  it('should return 200 for \'batches $id tasks $id read\'', async () => {
    const res = await cli(`batches ${ctx.batchId} tasks ${ctx.taskId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'batches $id tasks $id logs list\'', async () => {
    const res = await cli(`batches ${ctx.batchId} tasks ${ctx.taskId} logs list`);

    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'batches $id delete\'', async () => {
    const res = await cli(`batches ${ctx.batchId} delete`);

    expect(res.status).to.equal(200);
  });
});

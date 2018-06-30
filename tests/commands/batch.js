const { expect } = require('chai');

const { ctx } = require('../modules/util');
const cli = require('../../src/functions/cli');

const readTasks = async () => cli(`batch ${ctx.batchId} task list`);

const waitForTaskCompletion = async () => {
  let res = await readTasks();
  while (res.data[0].status !== 'EXECUTED') res = await readTasks();
};

describe('batch', async () => {
  it('should return 201 for \'batch create $payload\'', async () => {
    const payload = JSON.stringify({ name: 'Test batch' });
    const res = await cli(`batch create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.batchId = res.data.id;
  });

  it('should return 200 for \'batch list\'', async () => {
    const res = await cli('batch list');

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'batch $id read\'', async () => {
    const res = await cli(`batch ${ctx.batchId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'batch $id update $payload\'', async () => {
    const payload = JSON.stringify({ description: 'Updated description' });
    const res = await cli(`batch ${ctx.batchId} update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 202 for \'batch $id task create $payload\'', async () => {
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
    const res = await cli(`batch ${ctx.batchId} task create ${payload}`);

    expect(res.status).to.equal(202);

    await waitForTaskCompletion();
  });

  it('should return 200 for \'batch $id task list\'', async () => {
    const res = await cli(`batch ${ctx.batchId} task list`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');

    ctx.taskId = res.data[0].id;
  });

  it('should return 200 for \'batch $id task $id read\'', async () => {
    const res = await cli(`batch ${ctx.batchId} task ${ctx.taskId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'batch $id task $id logs list\'', async () => {
    const res = await cli(`batch ${ctx.batchId} task ${ctx.taskId} logs list`);

    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'batch $id delete\'', async () => {
    const res = await cli(`batch ${ctx.batchId} delete`);

    expect(res.status).to.equal(200);
  });
});

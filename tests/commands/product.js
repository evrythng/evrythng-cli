const { expect } = require('chai');

const { ctx } = require('../modules/util');
const cli = require('../../src/functions/cli');

const TEST_KEY = 'test';

describe('product', () => {
  before(async () => {
    const payload = JSON.stringify({ name: `_action-type-${Date.now()}` });
    const res = await cli(`action-type create ${payload}`);

    ctx.actionType = res.data.name;
  });

  after(async () => {
    await cli(`action-type ${ctx.actionType} delete`);
  });

  // Product CRUD
  it('should return 201 for \'product create $payload\'', async () => {
    const payload = JSON.stringify({ name: 'Test product' });
    const res = await cli(`product create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.productId = res.data.id;
  });

  it('should return 200 for \'product list\'', async () => {
    const res = await cli('product list');

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'product $id read\'', async () => {
    const res = await cli(`product ${ctx.productId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'product $id update $payload\'', async () => {
    const payload = JSON.stringify({ tags: ['test'] });
    const res = await cli(`product ${ctx.productId} update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  // Product properties
  it('should return 200 for \'product $id property create $payload\'', async () => {
    const payload = JSON.stringify([{ key: TEST_KEY, value: 'some value' }]);
    const res = await cli(`product ${ctx.productId} property create ${payload}`);

    expect(res.status).to.equal(200);
  });

  it('should return 200 for \'product $id property list\'', async () => {
    const res = await cli(`product ${ctx.productId} property list`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'product $id property $key read\'', async () => {
    const res = await cli(`product ${ctx.productId} property ${TEST_KEY} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'product $id property $key update $payload\'', async () => {
    const payload = JSON.stringify([{ value: 'some value' }]);
    const res = await cli(`product ${ctx.productId} property ${TEST_KEY} update ${payload}`);

    expect(res.status).to.equal(200);
  });

  it('should return 200 for \'product $id property $key delete\'', async () => {
    const res = await cli(`product ${ctx.productId} property ${TEST_KEY} delete`);

    expect(res.status).to.equal(200);
  });

  // Product actions
  it('should return 201 for \'product $id action create $payload\'', async () => {
    const payload = JSON.stringify({ type: ctx.actionType });
    const res = await cli(`product ${ctx.productId} action create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.actionId = res.data.id;
  });

  it('should return 200 for \'product $id action list\'', async () => {
    const res = await cli(`product ${ctx.productId} action list`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'product $id action $id read\'', async () => {
    const res = await cli(`product ${ctx.productId} action ${ctx.actionId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  // Product redirection
  it('should return 201 for \'product $id redirection create $payload\'', async () => {
    const payload = JSON.stringify({ defaultRedirectUrl: 'https://google.com/{shortId}/' });
    const res = await cli(`product ${ctx.productId} redirection create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'product $id redirection read\'', async () => {
    const res = await cli(`product ${ctx.productId} redirection read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 201 for \'product $id redirection update $payload\'', async () => {
    const payload = JSON.stringify({ defaultRedirectUrl: 'https://google.com/{shortId}/updates/' });
    const res = await cli(`product ${ctx.productId} redirection update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'product $id redirection delete\'', async () => {
    const res = await cli(`product ${ctx.productId} redirection delete`);

    expect(res.status).to.equal(200);
  });

  // Finally
  it('should return 200 for \'product $id delete\'', async () => {
    const res = await cli(`product ${ctx.productId} delete`);

    expect(res.status).to.equal(200);
  });
});

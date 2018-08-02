/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { expect } = require('chai');
const { ctx } = require('../modules/util');
const cli = require('../../src/functions/cli');

const TEST_KEY = 'test';

describe('products', () => {
  before(async () => {
    const payload = JSON.stringify({ name: `_action-type-${Date.now()}` });
    const res = await cli(`action-types create ${payload}`);

    ctx.actionType = res.data.name;
  });

  after(async () => {
    await cli(`action-types ${ctx.actionType} delete`);
  });

  // Product CRUD
  it('should return 201 for \'products create $payload\'', async () => {
    const payload = JSON.stringify({ name: 'Test product' });
    const res = await cli(`products create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.productId = res.data.id;
  });

  it('should return 200 for \'products list\'', async () => {
    const res = await cli('products list');

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'products $id read\'', async () => {
    const res = await cli(`products ${ctx.productId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'products $id update $payload\'', async () => {
    const payload = JSON.stringify({ tags: ['test'] });
    const res = await cli(`products ${ctx.productId} update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  // Product properties
  it('should return 200 for \'products $id properties create $payload\'', async () => {
    const payload = JSON.stringify([{ key: TEST_KEY, value: 'some value' }]);
    const res = await cli(`products ${ctx.productId} properties create ${payload}`);

    expect(res.status).to.equal(200);
  });

  it('should return 200 for \'products $id properties list\'', async () => {
    const res = await cli(`products ${ctx.productId} properties list`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'products $id properties $key read\'', async () => {
    const res = await cli(`products ${ctx.productId} properties ${TEST_KEY} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'products $id properties $key update $payload\'', async () => {
    const payload = JSON.stringify([{ value: 'some value' }]);
    const res = await cli(`products ${ctx.productId} properties ${TEST_KEY} update ${payload}`);

    expect(res.status).to.equal(200);
  });

  it('should return 200 for \'products $id properties $key delete\'', async () => {
    const res = await cli(`products ${ctx.productId} properties ${TEST_KEY} delete`);

    expect(res.status).to.equal(200);
  });

  // Product actions
  it('should return 201 for \'products $id actions create $payload\'', async () => {
    const payload = JSON.stringify({ type: ctx.actionType });
    const res = await cli(`products ${ctx.productId} actions create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.actionId = res.data.id;
  });

  it('should return 200 for \'products $id actions list\'', async () => {
    const res = await cli(`products ${ctx.productId} actions list`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'products $id actions $id read\'', async () => {
    const res = await cli(`products ${ctx.productId} actions ${ctx.actionId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  // Product redirection
  it('should return 201 for \'products $id redirection create $payload\'', async () => {
    const payload = JSON.stringify({ defaultRedirectUrl: 'https://google.com/{shortId}/' });
    const res = await cli(`products ${ctx.productId} redirection create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'products $id redirection read\'', async () => {
    const res = await cli(`products ${ctx.productId} redirection read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 201 for \'products $id redirection update $payload\'', async () => {
    const payload = JSON.stringify({ defaultRedirectUrl: 'https://google.com/{shortId}/updates/' });
    const res = await cli(`products ${ctx.productId} redirection update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'products $id redirection delete\'', async () => {
    const res = await cli(`products ${ctx.productId} redirection delete`);

    expect(res.status).to.equal(200);
  });

  // Finally
  it('should return 200 for \'products $id delete\'', async () => {
    const res = await cli(`products ${ctx.productId} delete`);

    expect(res.status).to.equal(200);
  });
});

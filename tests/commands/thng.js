/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { expect } = require('chai');
const { ctx } = require('../util');
const cli = require('../../src/functions/cli');

const TEST_KEY = 'test';

describe('thngs', () => {
  before(async () => {
    const payload = JSON.stringify({ name: `_action-type-${Date.now()}` });
    const res = await cli(`action-types create ${payload}`);

    ctx.actionType = res.data.name;
  });

  after(async () => {
    await cli(`action-types ${ctx.actionType} delete`);
  });

  // Thng CRUD
  it('should return 201 for \'thngs create $payload\'', async () => {
    const payload = JSON.stringify({ name: 'Test thng' });
    const res = await cli(`thngs create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.thngId = res.data.id;
  });

  it('should return 200 for \'thngs list\'', async () => {
    const res = await cli('thngs list');

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'thngs $id read\'', async () => {
    const res = await cli(`thngs ${ctx.thngId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'thngs $id update $payload\'', async () => {
    const payload = JSON.stringify({ tags: ['test'] });
    const res = await cli(`thngs ${ctx.thngId} update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  // Thng properties
  it('should return 200 for \'thngs $id properties create $payload\'', async () => {
    const payload = JSON.stringify([{ key: TEST_KEY, value: 'some value' }]);
    const res = await cli(`thngs ${ctx.thngId} properties create ${payload}`);

    expect(res.status).to.equal(200);
  });

  it('should return 200 for \'thngs $id properties list\'', async () => {
    const res = await cli(`thngs ${ctx.thngId} properties list`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'thngs $id properties $key read\'', async () => {
    const res = await cli(`thngs ${ctx.thngId} properties ${TEST_KEY} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'thngs $id properties $key update $payload\'', async () => {
    const payload = JSON.stringify([{ value: 'some value' }]);
    const res = await cli(`thngs ${ctx.thngId} properties ${TEST_KEY} update ${payload}`);

    expect(res.status).to.equal(200);
  });

  it('should return 200 for \'thngs $id properties $key delete\'', async () => {
    const res = await cli(`thngs ${ctx.thngId} properties ${TEST_KEY} delete`);

    expect(res.status).to.equal(200);
  });

  // Thng actions
  it('should return 201 for \'thngs $id actions create $payload\'', async () => {
    const payload = JSON.stringify({ type: ctx.actionType });
    const res = await cli(`thngs ${ctx.thngId} actions create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.actionId = res.data.id;
  });

  it('should return 200 for \'thngs $id actions list\'', async () => {
    const res = await cli(`thngs ${ctx.thngId} actions list`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'thngs $id actions $id read\'', async () => {
    const res = await cli(`thngs ${ctx.thngId} actions ${ctx.actionId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  // Thng redirection
  it('should return 201 for \'thngs $id redirection create $payload\'', async () => {
    const payload = JSON.stringify({ defaultRedirectUrl: 'https://google.com/{shortId}/' });
    const res = await cli(`thngs ${ctx.thngId} redirection create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'thngs $id redirection read\'', async () => {
    const res = await cli(`thngs ${ctx.thngId} redirection read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 201 for \'thngs $id redirection update $payload\'', async () => {
    const payload = JSON.stringify({ defaultRedirectUrl: 'https://google.com/{shortId}/updates/' });
    const res = await cli(`thngs ${ctx.thngId} redirection update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'thngs $id redirection delete\'', async () => {
    const res = await cli(`thngs ${ctx.thngId} redirection delete`);

    expect(res.status).to.equal(200);
  });

  // Thng location
  it('should return 200 for \'thngs $id location read\'', async () => {
    const res = await cli(`thngs ${ctx.thngId} location read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'thngs $id location update $payload\'', async () => {
    const payload = JSON.stringify([{
      position: { type: 'Point', coordinates: [ -17.3, 36 ] },
    }]);
    const res = await cli(`thngs ${ctx.thngId} location update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'thngs $id location delete\'', async () => {
    const res = await cli(`thngs ${ctx.thngId} location delete`);

    expect(res.status).to.equal(200);
  });

  // Thng Device API Key
  it('should return 201 for \'thngs device-key create $payload\'', async () => {
    const payload = JSON.stringify({ thngId: ctx.thngId });
    const res = await cli(`thngs device-key create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'thngs $id device-key read\'', async () => {
    const payload = JSON.stringify({ thngId: ctx.thngId });
    const res = await cli(`thngs ${ctx.thngId} device-key read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'thngs $id device-key delete\'', async () => {
    const payload = JSON.stringify({ thngId: ctx.thngId });
    const res = await cli(`thngs ${ctx.thngId} device-key delete`);

    expect(res.status).to.equal(200);
  });

  // Finally
  it('should return 200 for \'thngs $id delete\'', async () => {
    const res = await cli(`thngs ${ctx.thngId} delete`);

    expect(res.status).to.equal(200);
  });
});

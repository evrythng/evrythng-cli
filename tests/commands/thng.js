const { expect } = require('chai');

const { ctx } = require('../modules/util');
const cli = require('../../src/functions/cli');

const TEST_KEY = 'test';

describe('thng', () => {
  before(async () => {
    const payload = JSON.stringify({ name: `_action-type-${Date.now()}` });
    const res = await cli(`action-type create ${payload}`);

    ctx.actionType = res.data.name;
  });

  after(async () => {
    await cli(`action-type ${ctx.actionType} delete`);
  });

  // Thng CRUD
  it('should return 201 for \'thng create $payload\'', async () => {
    const payload = JSON.stringify({ name: 'Test thng' });
    const res = await cli(`thng create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.thngId = res.data.id;
  });

  it('should return 200 for \'thng list\'', async () => {
    const res = await cli('thng list');

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'thng $id read\'', async () => {
    const res = await cli(`thng ${ctx.thngId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'thng $id update $payload\'', async () => {
    const payload = JSON.stringify({ tags: ['test'] });
    const res = await cli(`thng ${ctx.thngId} update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  // Thng properties
  it('should return 200 for \'thng $id property create $payload\'', async () => {
    const payload = JSON.stringify([{ key: TEST_KEY, value: 'some value' }]);
    const res = await cli(`thng ${ctx.thngId} property create ${payload}`);

    expect(res.status).to.equal(200);
  });

  it('should return 200 for \'thng $id property list\'', async () => {
    const res = await cli(`thng ${ctx.thngId} property list`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'thng $id property $key read\'', async () => {
    const res = await cli(`thng ${ctx.thngId} property ${TEST_KEY} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'thng $id property $key update $payload\'', async () => {
    const payload = JSON.stringify([{ value: 'some value' }]);
    const res = await cli(`thng ${ctx.thngId} property ${TEST_KEY} update ${payload}`);

    expect(res.status).to.equal(200);
  });

  it('should return 200 for \'thng $id property $key delete\'', async () => {
    const res = await cli(`thng ${ctx.thngId} property ${TEST_KEY} delete`);

    expect(res.status).to.equal(200);
  });

  // Thng actions
  it('should return 201 for \'thng $id action create $payload\'', async () => {
    const payload = JSON.stringify({ type: ctx.actionType });
    const res = await cli(`thng ${ctx.thngId} action create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.actionId = res.data.id;
  });

  it('should return 200 for \'thng $id action list\'', async () => {
    const res = await cli(`thng ${ctx.thngId} action list`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'thng $id action $id read\'', async () => {
    const res = await cli(`thng ${ctx.thngId} action ${ctx.actionId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  // Thng redirection
  it('should return 201 for \'thng $id redirection create $payload\'', async () => {
    const payload = JSON.stringify({ defaultRedirectUrl: 'https://google.com/{shortId}/' });
    const res = await cli(`thng ${ctx.thngId} redirection create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'thng $id redirection read\'', async () => {
    const res = await cli(`thng ${ctx.thngId} redirection read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 201 for \'thng $id redirection update $payload\'', async () => {
    const payload = JSON.stringify({ defaultRedirectUrl: 'https://google.com/{shortId}/updates/' });
    const res = await cli(`thng ${ctx.thngId} redirection update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'thng $id redirection delete\'', async () => {
    const res = await cli(`thng ${ctx.thngId} redirection delete`);

    expect(res.status).to.equal(200);
  });

  // Thng location
  it('should return 200 for \'thng $id location read\'', async () => {
    const res = await cli(`thng ${ctx.thngId} location read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'thng $id location update $payload\'', async () => {
    const payload = JSON.stringify([{
      position: { type: 'Point', coordinates: [ -17.3, 36 ] },
    }]);
    const res = await cli(`thng ${ctx.thngId} location update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'thng $id location delete\'', async () => {
    const res = await cli(`thng ${ctx.thngId} location delete`);

    expect(res.status).to.equal(200);
  });

  // Thng Device API Key
  it('should return 201 for \'thng device-key create $payload\'', async () => {
    const payload = JSON.stringify({ thngId: ctx.thngId });
    const res = await cli(`thng device-key create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'thng $id device-key read\'', async () => {
    const payload = JSON.stringify({ thngId: ctx.thngId });
    const res = await cli(`thng ${ctx.thngId} device-key read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'thng $id device-key delete\'', async () => {
    const payload = JSON.stringify({ thngId: ctx.thngId });
    const res = await cli(`thng ${ctx.thngId} device-key delete`);

    expect(res.status).to.equal(200);
  });

  // Finally
  it('should return 200 for \'thng $id delete\'', async () => {
    const res = await cli(`thng ${ctx.thngId} delete`);

    expect(res.status).to.equal(200);
  });
});

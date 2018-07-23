const { expect } = require('chai');
const { ctx } = require('../modules/util');
const cli = require('../../src/functions/cli');

describe('action', () => {
  before(async () => {
    const payload = JSON.stringify({ name: `_action-type-${Date.now()}` });
    const res = await cli(`action-type create ${payload}`);

    ctx.actionType = res.data.name;
  });

  after(async () => {
    await cli(`action-type ${ctx.actionType} delete`);
  });

  it('should return 201 for \'action $type create $payload\'', async () => {
    const payload = JSON.stringify({ type: ctx.actionType });
    const res = await cli(`action ${ctx.actionType} create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.actionId = res.data.id;
  });

  it('should return 200 for \'action $type list\'', async () => {
    const res = await cli(`action ${ctx.actionType} list`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'action $type $id read\'', async () => {
    const res = await cli(`action ${ctx.actionType} ${ctx.actionId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'action $type $id delete\'', async () => {
    const res = await cli(`action ${ctx.actionType} ${ctx.actionId} delete`);

    expect(res.status).to.equal(200);
  });
});

/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { expect } = require('chai');
const { ctx } = require('../modules/util');
const cli = require('../../src/functions/cli');

describe('actions', () => {
  before(async () => {
    const payload = JSON.stringify({ name: `_action-type-${Date.now()}` });
    const res = await cli(`action-types create ${payload}`);

    ctx.actionType = res.data.name;
  });

  after(async () => {
    await cli(`action-types ${ctx.actionType} delete`);
  });

  it('should return 201 for \'actions $type create $payload\'', async () => {
    const payload = JSON.stringify({ type: ctx.actionType });
    const res = await cli(`actions ${ctx.actionType} create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.actionId = res.data.id;
  });

  it('should return 200 for \'actions $type list\'', async () => {
    const res = await cli(`actions ${ctx.actionType} list`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'actions $type $id read\'', async () => {
    const res = await cli(`actions ${ctx.actionType} ${ctx.actionId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'actions $type $id delete\'', async () => {
    const res = await cli(`actions ${ctx.actionType} ${ctx.actionId} delete`);

    expect(res.status).to.equal(200);
  });
});

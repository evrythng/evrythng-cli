/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { expect } = require('chai');
const { ctx } = require('../modules/util');
const cli = require('../../src/functions/cli');

describe('action-types', () => {
  it('should return 201 for \'action-types create $payload\'', async () => {
    const payload = JSON.stringify({ name: `_action-type-${Date.now()}` });
    const res = await cli(`action-types create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.actionType = res.data.name;
  });

  it('should return 200 for \'action-types list\'', async () => {
    const res = await cli('action-types list');

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'action-types $type update $payload\'', async () => {
    const payload = JSON.stringify({ description: 'Example action type' });
    const res = await cli(`action-types ${ctx.actionType} update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'action-types $type delete\'', async () => {
    const res = await cli(`action-types ${ctx.actionType} delete`);

    expect(res.status).to.equal(200);
  });
});

const { expect } = require('chai');
const { ctx } = require('../modules/util');
const cli = require('../../src/functions/cli');

describe('action-type', () => {
  it('should return 201 for \'action-type create $payload\'', async () => {
    const payload = JSON.stringify({ name: `_action-type-${Date.now()}` });
    const res = await cli(`action-type create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.actionType = res.data.name;
  });

  it('should return 200 for \'action-type list\'', async () => {
    const res = await cli('action-type list');

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'action-type $type update $payload\'', async () => {
    const payload = JSON.stringify({ description: 'Example action type' });
    const res = await cli(`action-type ${ctx.actionType} update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'action-type $type delete\'', async () => {
    const res = await cli(`action-type ${ctx.actionType} delete`);

    expect(res.status).to.equal(200);
  });
});

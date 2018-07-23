const { expect } = require('chai');
const { ctx } = require('../modules/util');
const cli = require('../../src/functions/cli');

describe('collection', () => {
  before(async () => {
    let payload = JSON.stringify({ name: `_action-type-${Date.now()}` });
    let res = await cli(`action-type create ${payload}`);

    ctx.actionType = res.data.name;

    payload = JSON.stringify({ name: 'Child collection' });
    res = await cli(`collection create ${payload}`);

    ctx.childId = res.data.id;

    res = await cli('thng list');
    ctx.thngId = res.data[0].id;
  });

  after(async () => {
    await cli(`action-type ${ctx.actionType} delete`);
    await cli(`collection ${ctx.childId} delete`);
  });

  it('should return 201 for \'collection create $payload\'', async () => {
    const payload = JSON.stringify({ name: 'Test collection' });
    const res = await cli(`collection create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.parentId = res.data.id;
  });

  it('should return 200 for \'collection list\'', async () => {
    const res = await cli('collection list');

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'collection $id read\'', async () => {
    const res = await cli(`collection ${ctx.parentId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'collection $id update $payload\'', async () => {
    const payload = JSON.stringify({ description: 'Updated description' });
    const res = await cli(`collection ${ctx.parentId} update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 201 for \'collection $id action create $payload\'', async () => {
    const payload = JSON.stringify({ type: ctx.actionType });
    const res = await cli(`collection ${ctx.parentId} action create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.actionId = res.data.id;
  });

  it('should return 200 for \'collection $id action list\'', async () => {
    const res = await cli(`collection ${ctx.parentId} action list`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'collection $id action $id read\'', async () => {
    const res = await cli(`collection ${ctx.parentId} action ${ctx.actionId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'collection $id collection add $payload\'', async () => {
    const payload = JSON.stringify([ctx.childId]);
    const res = await cli(`collection ${ctx.parentId} collection add ${payload}`);

    expect(res.status).to.equal(200);
  });

  it('should return 200 for \'collection $id collection list\'', async () => {
    const res = await cli(`collection ${ctx.parentId} collection list`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'collection $id collection $id delete\'', async () => {
    const res = await cli(`collection ${ctx.parentId} collection ${ctx.childId} delete`);

    expect(res.status).to.equal(200);

    // Add again for the next test
    const payload = JSON.stringify([ctx.childId]);
    await cli(`collection ${ctx.parentId} collection add ${payload}`);
  });

  it('should return 200 for \'collection $id collection delete\'', async () => {
    const res = await cli(`collection ${ctx.parentId} collection delete`);

    expect(res.status).to.equal(200);
  });

  it('should return 200 for \'collection $id thng add $payload\'', async () => {
    const payload = JSON.stringify([ctx.thngId]);
    const res = await cli(`collection ${ctx.parentId} thng add ${payload}`);

    expect(res.status).to.equal(200);
  });

  it('should return 200 for \'collection $id thng list\'', async () => {
    const res = await cli(`collection ${ctx.parentId} thng list`);

    expect(res.status).to.equal(200);
  });

  it('should return 200 for \'collection $id thng $id delete\'', async () => {
    const res = await cli(`collection ${ctx.parentId} thng ${ctx.thngId} delete`);

    expect(res.status).to.equal(200);

    // Add again for the next test
    const payload = JSON.stringify([ctx.thngId]);
    await cli(`collection ${ctx.parentId} thng add ${payload}`);
  });

  it('should return 200 for \'collection $id thng delete\'', async () => {
    const res = await cli(`collection ${ctx.parentId} thng delete`);

    expect(res.status).to.equal(200);
  });

  it('should return 200 for \'collection $id delete\'', async () => {
    const res = await cli(`collection ${ctx.parentId} delete`);

    expect(res.status).to.equal(200);
  });
});

const { expect } = require('chai');
const { ctx } = require('../modules/util');
const cli = require('../../src/functions/cli');

describe('collections', () => {
  before(async () => {
    let payload = JSON.stringify({ name: `_action-type-${Date.now()}` });
    let res = await cli(`action-types create ${payload}`);

    ctx.actionType = res.data.name;

    payload = JSON.stringify({ name: 'Child collection' });
    res = await cli(`collections create ${payload}`);

    ctx.childId = res.data.id;

    res = await cli('thngs list');
    ctx.thngId = res.data[0].id;
  });

  after(async () => {
    await cli(`action-types ${ctx.actionType} delete`);
    await cli(`collections ${ctx.childId} delete`);
  });

  it('should return 201 for \'collections create $payload\'', async () => {
    const payload = JSON.stringify({ name: 'Test collection' });
    const res = await cli(`collections create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.parentId = res.data.id;
  });

  it('should return 200 for \'collections list\'', async () => {
    const res = await cli('collections list');

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'collections $id read\'', async () => {
    const res = await cli(`collections ${ctx.parentId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'collections $id update $payload\'', async () => {
    const payload = JSON.stringify({ description: 'Updated description' });
    const res = await cli(`collections ${ctx.parentId} update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 201 for \'collections $id actions create $payload\'', async () => {
    const payload = JSON.stringify({ type: ctx.actionType });
    const res = await cli(`collections ${ctx.parentId} actions create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.actionId = res.data.id;
  });

  it('should return 200 for \'collections $id actions list\'', async () => {
    const res = await cli(`collections ${ctx.parentId} actions list`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'collections $id actions $id read\'', async () => {
    const res = await cli(`collections ${ctx.parentId} actions ${ctx.actionId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'collections $id collections add $payload\'', async () => {
    const payload = JSON.stringify([ctx.childId]);
    const res = await cli(`collections ${ctx.parentId} collections add ${payload}`);

    expect(res.status).to.equal(200);
  });

  it('should return 200 for \'collections $id collections list\'', async () => {
    const res = await cli(`collections ${ctx.parentId} collections list`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'collections $id collections $id delete\'', async () => {
    const res = await cli(`collections ${ctx.parentId} collections ${ctx.childId} delete`);

    expect(res.status).to.equal(200);

    // Add again for the next test
    const payload = JSON.stringify([ctx.childId]);
    await cli(`collections ${ctx.parentId} collections add ${payload}`);
  });

  it('should return 200 for \'collections $id collections delete\'', async () => {
    const res = await cli(`collections ${ctx.parentId} collections delete`);

    expect(res.status).to.equal(200);
  });

  it('should return 200 for \'collections $id thngs add $payload\'', async () => {
    const payload = JSON.stringify([ctx.thngId]);
    const res = await cli(`collections ${ctx.parentId} thngs add ${payload}`);

    expect(res.status).to.equal(200);
  });

  it('should return 200 for \'collections $id thngs list\'', async () => {
    const res = await cli(`collections ${ctx.parentId} thngs list`);

    expect(res.status).to.equal(200);
  });

  it('should return 200 for \'collections $id thngs $id delete\'', async () => {
    const res = await cli(`collections ${ctx.parentId} thngs ${ctx.thngId} delete`);

    expect(res.status).to.equal(200);

    // Add again for the next test
    const payload = JSON.stringify([ctx.thngId]);
    await cli(`collections ${ctx.parentId} thngs add ${payload}`);
  });

  it('should return 200 for \'collections $id thngs delete\'', async () => {
    const res = await cli(`collections ${ctx.parentId} thngs delete`);

    expect(res.status).to.equal(200);
  });

  it('should return 200 for \'collections $id delete\'', async () => {
    const res = await cli(`collections ${ctx.parentId} delete`);

    expect(res.status).to.equal(200);
  });
});

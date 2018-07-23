const { expect } = require('chai');
const { ctx } = require('../modules/util');
const cli = require('../../src/functions/cli');

describe('place', () => {
  it('should return 201 for \'place create $payload\'', async () => {
    const payload = JSON.stringify({ name: 'Test place' });
    const res = await cli(`place create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.placeId = res.data.id;
  });

  it('should return 200 for \'place list\'', async () => {
    const res = await cli('place list');

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'place $id read\'', async () => {
    const res = await cli(`place ${ctx.placeId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'place $id update $payload\'', async () => {
    const payload = JSON.stringify({ tags: ['test'] });
    const res = await cli(`place ${ctx.placeId} update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'place $id delete\'', async () => {
    const res = await cli(`place ${ctx.placeId} delete`);

    expect(res.status).to.equal(200);
  });
});
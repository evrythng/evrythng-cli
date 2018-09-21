/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { expect } = require('chai');
const { ctx } = require('../util');
const cli = require('../../src/functions/cli');

describe('places', () => {
  it('should return 201 for \'places create $payload\'', async () => {
    const payload = JSON.stringify({ name: 'Test place' });
    const res = await cli(`places create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.placeId = res.data.id;
  });

  it('should return 200 for \'places list\'', async () => {
    const res = await cli('places list');

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'places $id read\'', async () => {
    const res = await cli(`places ${ctx.placeId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'places $id update $payload\'', async () => {
    const payload = JSON.stringify({ tags: ['test'] });
    const res = await cli(`places ${ctx.placeId} update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'places $id delete\'', async () => {
    const res = await cli(`places ${ctx.placeId} delete`);

    expect(res.status).to.equal(200);
  });
});
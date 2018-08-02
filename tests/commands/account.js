/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { expect } = require('chai');
const { ctx } = require('../modules/util');
const cli = require('../../src/functions/cli');

describe('accounts', () => {
  it('should return 200 for \'accounts list\'', async () => {
    const res = await cli('accounts list');

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');

    ctx.accountId = res.data[0].id;
  });

  it('should return 200 for \'accounts $id read\'', async () => {
    const res = await cli(`accounts ${ctx.accountId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'accounts $id update $payload\'', async () => {
    const payload = JSON.stringify({ imageUrl: '' });
    const res = await cli(`accounts ${ctx.accountId} update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'accounts $id accesses list\'', async () => {
    const res = await cli(`accounts ${ctx.accountId} accesses list`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');

    ctx.access = res.data[0];
  });

  it('should return 200 for \'accounts $id accesses $id read\'', async () => {
    const res = await cli(`accounts ${ctx.accountId} accesses ${ctx.access.id} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'accounts $id accesses $id update $payload\'', async () => {
    const payload = JSON.stringify({ role: ctx.access.role });
    const res = await cli(`accounts ${ctx.accountId} accesses ${ctx.access.id} update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'accounts $id domains list\'', async () => {
    const res = await cli(`accounts ${ctx.accountId} domains list`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'accounts $id short-domains list\'', async () => {
    const res = await cli(`accounts ${ctx.accountId} short-domains list`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });
});

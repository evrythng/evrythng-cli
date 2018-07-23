const { expect } = require('chai');
const { ctx } = require('../modules/util');
const cli = require('../../src/functions/cli');

describe('account', () => {
  it('should return 200 for \'account list\'', async () => {
    const res = await cli('account list');

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');

    ctx.accountId = res.data[0].id;
  });

  it('should return 200 for \'account $id read\'', async () => {
    const res = await cli(`account ${ctx.accountId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'account $id update $payload\'', async () => {
    const payload = JSON.stringify({ imageUrl: '' });
    const res = await cli(`account ${ctx.accountId} update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'account $id access list\'', async () => {
    const res = await cli(`account ${ctx.accountId} access list`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');

    ctx.access = res.data[0];
  });

  it('should return 200 for \'account $id access $id read\'', async () => {
    const res = await cli(`account ${ctx.accountId} access ${ctx.access.id} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'account $id access $id update $payload\'', async () => {
    const payload = JSON.stringify({ role: ctx.access.role });
    const res = await cli(`account ${ctx.accountId} access ${ctx.access.id} update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'account $id domain list\'', async () => {
    const res = await cli(`account ${ctx.accountId} domain list`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'account $id short-domain list\'', async () => {
    const res = await cli(`account ${ctx.accountId} short-domain list`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });
});

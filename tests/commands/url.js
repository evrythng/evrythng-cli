/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { expect } = require('chai');
const { ctx } = require('../util');
const cli = require('../../src/functions/cli');

describe('url', () => {
  it('should return 201 for \'url post $url $payload\'', async () => {
    const payload = JSON.stringify({ name: 'Test Thng' });
    const res = await cli(`url post /thngs ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.thngId = res.data.id;
  });

  it('should return 200 for \'url get $url\'', async () => {
    const res = await cli('url get /thngs');

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'url put $url $payload\'', async () => {
    const payload = JSON.stringify({ name: 'Updated Thng' });
    const res = await cli(`url put /thngs/${ctx.thngId} ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'url delete $url\'', async () => {
    const res = await cli(`url delete /thngs/${ctx.thngId}`);

    expect(res.status).to.equal(200);
  });
});

/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { expect } = require('chai');
const cli = require('../../src/functions/cli');

describe('redirector', () => {
  it('should return 200 for \'redirector read\'', async () => {
    const res = await cli(`redirector read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'redirector update $payload\'', async () => {
    const payload = JSON.stringify({
      rules: [{ match: 'thng.name=test', delegates: [] }],
    });
    const res = await cli(`redirector update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });
});

const { expect } = require('chai');
const cli = require('../../src/functions/cli');

describe('rate-limit', () => {
  it('should return 200 for \'rate-limit read\'', async () => {
    const res = await cli(`rate-limit read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });
});

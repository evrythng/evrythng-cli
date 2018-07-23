const { expect } = require('chai');
const cli = require('../../src/functions/cli');

describe('access', () => {
  it('should return 200 for \'access read\'', async () => {
    const res = await cli('access read');

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });
});

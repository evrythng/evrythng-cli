const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { ctx } = require('../modules/util');
const cli = require('../../src/functions/cli');
const config = require('../../src/modules/config');

chai.should();
chai.use(chaiAsPromised);

const { expect } = chai;

describe('region', () => {
  it('return object for \'region add $name $apiUrl\'', async () => {
    ctx.regionName = 'test-region';
    const apiUrl = 'https://test-api.evrythng.com';
    const res = await cli(`region add ${ctx.regionName} ${apiUrl}`);

    expect(res).to.be.an('object');
    expect(res[ctx.regionName]).to.be.a('string');
    expect(res[ctx.regionName]).to.equal(apiUrl);
  });

  it('should return array for \'region list\'', async () => {
    const res = await cli('region list');

    expect(res).to.be.an('array');
    expect(res).to.have.length.gte(1);
  });

  it('should not throw error for \'region $name remove\'', async () => {
    return cli(`region ${ctx.regionName} remove`).should.be.fulfilled;
  });
});

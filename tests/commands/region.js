const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { ctx } = require('../modules/util');
const cli = require('../../src/functions/cli');
const config = require('../../src/modules/config');

chai.should();
chai.use(chaiAsPromised);

const { expect } = chai;

describe('regions', () => {
  it('return object for \'regions add $name $apiUrl\'', async () => {
    ctx.regionName = 'test-region';
    const apiUrl = 'https://test-api.evrythng.com';
    const res = await cli(`regions add ${ctx.regionName} ${apiUrl}`);

    expect(res).to.be.an('object');
    expect(res[ctx.regionName]).to.be.a('string');
    expect(res[ctx.regionName]).to.equal(apiUrl);
  });

  it('should return array for \'regions list\'', async () => {
    const res = await cli('regions list');

    expect(res).to.be.an('array');
    expect(res).to.have.length.gte(1);
  });

  it('should not throw error for \'regions $name remove\'', async () => {
    return cli(`regions ${ctx.regionName} remove`).should.be.fulfilled;
  });
});

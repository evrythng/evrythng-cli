/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { ctx } = require('../util');
const cli = require('../../src/functions/cli');
const config = require('../../src/modules/config');
const region = require('../../src/commands/region');

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

  it('should throw if a region name does not exist', () => {
    const check = () => region.checkRegionExists('foo');

    expect(check).to.throw();
  });

  it('should throw if a region name is more than one word', () => {
    const add = () => region.addRegion([, 'two words', 'https://api.evrythng.com']);

    expect(add).to.throw();
  });
});

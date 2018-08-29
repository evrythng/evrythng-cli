/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { ctx } = require('../util');
const cli = require('../../src/functions/cli');
const config = require('../../src/modules/config');

chai.should();
chai.use(chaiAsPromised);

const { expect } = chai;

describe('operators', () => {
  before(async () => {
    const res = await cli('operators list');

    ctx.using = res.using;
  });

  after(async () => {
    await cli(`operators ${ctx.using} use`);
  });

  it('return object for \'operators add $name $region $apiKey\'', async () => {
    ctx.operatorName = 'test-operator';
    const key = '12345687123456812345678123456781234567812345678123456871234568712345678123465781';
    const res = await cli(`operators add ${ctx.operatorName} us ${key}`);

    expect(res).to.be.an('object');
    expect(res.apiKey).to.be.a('string');
    expect(res.apiKey).to.have.length(80);

    const isValidRegionValue = val => ['us', 'eu'].includes(val);
    expect(res.region).to.satisfy(isValidRegionValue);
  });

  it('should return object for \'operators list\'', async () => {
    const res = await cli('operators list');

    expect(res).to.be.an('object');
    expect(res.operators).to.be.an('array');
    expect(res.operators).to.have.length.gte(1);
    expect(res.using).to.be.a('string');
  });

  it('should return string for \'operators $name read\'', async () => {
    const res = await cli(`operators ${ctx.operatorName} read`);

    expect(res).to.be.a('string');
    expect(res).to.have.length(80);
  });

  it('should not throw error for \'operators $name use\'', async () => {
    return cli(`operators ${ctx.operatorName} use`).should.be.fulfilled;
  });

  it('should not throw error for \'operators $name remove\'', async () => {
    return cli(`operators ${ctx.operatorName} remove`).should.be.fulfilled;
  });
});

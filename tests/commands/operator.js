const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const config = require('../../src/modules/config');
const cli = require('../../src/functions/cli');
const { ctx } = require('../modules/util');

chai.should();
chai.use(chaiAsPromised);

const { expect } = chai;

describe('operator', () => {
  before(async () => {
    const res = await cli('operator list');

    ctx.using = res.using;
  });

  after(async () => {
    await cli(`operator ${ctx.using} use`);
  });

  it('return object for \'operator add $name $region $apiKey\'', async () => {
    ctx.operatorName = 'test-operator';
    const key = '12345687123456812345678123456781234567812345678123456871234568712345678123465781';
    const res = await cli(`operator add ${ctx.operatorName} us ${key}`);

    expect(res).to.be.an('object');
    expect(res.apiKey).to.be.a('string');
    expect(res.apiKey).to.have.length(80);

    const isValidRegionValue = val => ['us', 'eu'].includes(val);
    expect(res.region).to.satisfy(isValidRegionValue);
  });

  it('should return object for \'operator list\'', async () => {
    const res = await cli('operator list');

    expect(res).to.be.an('object');
    expect(res.operators).to.be.an('array');
    expect(res.operators).to.have.length.gte(1);
    expect(res.using).to.be.a('string');
  });

  it('should return string for \'operator $name read\'', async () => {
    const res = await cli(`operator ${ctx.operatorName} read`);

    expect(res).to.be.a('string');
    expect(res).to.have.length(80);
  });

  it('should not throw error for \'operator $name use\'', async () => {
    return cli(`operator ${ctx.operatorName} use`).should.be.fulfilled;
  });

  it('should not throw error for \'operator $name remove\'', async () => {
    return cli(`operator ${ctx.operatorName} remove`).should.be.fulfilled;
  });
});

const { expect } = require('chai');
const { ctx } = require('./modules/util');
const cli = require('../src/functions/cli');
const operator = require('../src/commands/operator');
const switches = require('../src/modules/switches');

describe('switches', () => {
  it('should accept the --filter switch', async () => {
    const res = await cli('thng list --filter tags=test');
    switches.unset(switches.FILTER);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should accept the --scopes switch', async () => {
    const res = await cli('thng list --scopes');
    switches.unset(switches.SCOPES);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should accept the --perpage switch', async () => {
    const res = await cli('thng list --perpage 1');
    switches.unset(switches.PER_PAGE);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should accept the --summary switch', async () => {
    const res = await cli('thng list --summary');
    switches.unset(switches.SUMMARY);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should accept the --api-key switch', async () => {
    const res = await cli(`thng list --api-key ${operator.getKey()}`);
    switches.unset(switches.API_KEY);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should accept the --expand switch', async () => {
    const res = await cli('thng list --expand');
    switches.unset(switches.EXPAND);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should accept the --field switch', async () => {
    const res = await cli('access read --field account');
    switches.unset(switches.FIELD);

    expect(res).to.be.a('string');
  });

  it('should accept the --simple switch', async () => {
    const res = await cli('thng list --simple');
    switches.unset(switches.SIMPLE);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should accept the --project switch', async () => {
    let res = await cli('project list');
    res = await cli(`thng list --project ${res.data[0].id}`);
    switches.unset(switches.PROJECT);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should accept the --page switch', async () => {
    const res = await cli('thng list --page 1');
    switches.unset(switches.PAGE);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });
});
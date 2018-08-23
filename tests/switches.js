/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { expect } = require('chai');
const { ctx } = require('./modules/util');
const cli = require('../src/functions/cli');
const operator = require('../src/commands/operator');
const switches = require('../src/modules/switches');

describe('switches', () => {
  it('should accept the --filter switch', async () => {
    const res = await cli('thngs list --filter tags=test');
    switches.FILTER = false;

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should accept the --with-scopes switch', async () => {
    const res = await cli('thngs list --with-scopes');
    switches.SCOPES = false;

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should accept the --per-page switch', async () => {
    const res = await cli('thngs list --per-page 1');
    switches.PER_PAGE = false;

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
    expect(res.data).to.have.length(1);
  });

  it('should accept the --summary switch', async () => {
    const res = await cli('thngs list --summary');
    switches.SUMMARY = false;

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should accept the --api-key switch', async () => {
    const res = await cli(`thngs list --api-key ${operator.getKey()}`);
    switches.API_KEY = false;

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should accept the --expand switch', async () => {
    const res = await cli('products list --expand');
    switches.EXPAND = false;

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should accept the --field switch', async () => {
    const res = await cli('access read --field account');
    switches.FIELD = false;

    expect(res).to.be.a('string');
  });

  it('should accept the --simple switch', async () => {
    const res = await cli('thngs list --simple');
    switches.SIMPLE = false;

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should accept the --project switch', async () => {
    let res = await cli('projects list');
    res = await cli(`thngs list --project ${res.data[0].id}`);
    switches.PROJECT = false;

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should accept the --page switch', async () => {
    const res = await cli('thngs list --page 1');
    switches.PAGE = false;

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should accept the --context switch', async () => {
    const res = await cli('actions scans list --context');
    switches.CONTEXT = false;

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should accept the --to-page switch', async () => {
    const res = await cli('thngs list --to-page 5');
    switches.TO_PAGE = false;

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });
});
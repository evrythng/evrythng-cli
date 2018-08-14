/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { expect } = require('chai');
const sinon = require('sinon');
const prompt = require('../src/modules/prompt');

describe('prompt', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should identify a valid boolean string', async () => {
    const res = prompt.isBooleanString('false');
    expect(res).to.equal(true);
  });

  it('should identify an invalid boolean string', async () => {
    const res = prompt.isBooleanString(32);
    expect(res).to.equal(false);
  });

  it('should identify valid JSON', async () => {
    const res = prompt.isJSONString('{ "foo": "bar" }');
    expect(res).to.equal(true);
  });

  it('should identify invalid JSON', async () => {
    const res = prompt.isJSONString('somestring');
    expect(res).to.equal(false);
  });

  it('should accept an input value', async () => {
    const expected = 'somevalue';
    sinon.stub(prompt, 'getValue').returns(expected);

    const res = await prompt.getValue('some value');
    expect(res).to.equal(expected);
  });
});

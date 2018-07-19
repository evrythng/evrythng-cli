const { expect } = require('chai');

const prompt = require('../src/modules/prompt');

describe('prompt', () => {
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
    const res = prompt.isJSONString("somestring");
    expect(res).to.equal(false);
  });
});
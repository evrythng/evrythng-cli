/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { expect } = require('chai');
const sinon = require('sinon');
const prompt = require('../src/modules/prompt');
const switches = require('../src/modules/switches');
const util = require('../src/modules/util');

describe('util', () => {
  afterEach(() => {
    switches.unset(switches.BUILD);
    sinon.resetBehavior();
  });

  it('should know an ID is 24 characters long', () => {
    const id = 'UKAVpbnsVDPa9Kaaam7a5tdp';

    const isId = () => util.isId(id);
    expect(isId()).to.equal(true);
  });

  it('should pretty format a JSON string', () => {
    const json = [{key: 'value'}];
    const expected = '[\n  {\n    "key": "value"\n  }\n]';

    const pretty = () => util.pretty(json);
    expect(pretty()).to.equal(expected);
  });

  it('should not throw error for printListSummary()', () => {
    const list = [
      { id: 'UKAVpbnsVDPa9Kaaam7a5tdp', name: 'thng1' },
      { id: 'UKAVpbnsVDPa9Kaaam7a5td2', name: 'thng2' }
    ];

    const printListSummary = () => util.printListSummary(list);
    expect(printListSummary).to.not.throw();
  });

  it('should not throw error for printSimple()', () => {
    const data = [
      { id: 'UKAVpbnsVDPa9Kaaam7a5tdp', name: 'thng1' },
      { id: 'UKAVpbnsVDPa9Kaaam7a5td2', name: 'thng2' }
    ];

    const printSimple = () => util.printSimple(data);
    expect(printSimple).to.not.throw();
  });

  it('should not throw and error for requireKey', () => {
    const key = '12345687123456812345678123456781234567812345678123456871234568712345678123465781';
    switches.set(switches.API_KEY, key);

    const requireKey = () => util.requireKey('Application');
    expect(requireKey).to.not.throw();
  });

  it('should build a correct thng payload using the user prompts', async () => {
    switches.set(switches.BUILD, true);
    sinon.stub(prompt, 'getValue')
      .onCall(0).returns('TestThng')
      .returns('');

    const payload = await util.getPayload('ThngDocument');
    expect(payload).to.have.property('name', 'TestThng');
  });

  it('should build the correct thng payload using JSON', async () => {
    const payload = await util.getPayload('ThngDocument', '{"name":"TestThng"}');
    expect(payload).to.have.property('name', 'TestThng');
  });
});

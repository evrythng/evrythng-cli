/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { expect } = require('chai');
const expand = require('../../src/functions/expand');
const indent = require('../../src/functions/indent');

describe('functions', () => {
  it('should expand an example object payload', async () => {
    const original = {
      id: 'UpAVKdVNBMPNQrRRa2kdTgWd',
      createdAt: 1530180429250,
      updatedAt: 1530180429250,
      name: 'List Based Task Thng / IDF20170001',
      properties: {},
      identifiers: {
        shortId: 'IDF20170001'
      },
    };

    const expected = {
      id: 'UpAVKdVNBMPNQrRRa2kdTgWd',
      createdAt: '6/28/2018, 11:07:09 AM',
      updatedAt: '6/28/2018, 11:07:09 AM',
      name: 'List Based Task Thng / IDF20170001',
      properties: {},
      identifiers: {
        shortId: 'IDF20170001'
      },
    };

    const input = JSON.parse(JSON.stringify(original));
    await expand(input);
    expect(input).to.deep.equal(expected);
  });

  it('should expand an example array payload', async () => {
    const original = [{
      id: 'UpAVKdVNBMPNQrRRa2kdTgWd',
      createdAt: 1530180429250,
      updatedAt: 1530180429250,
      name: 'List Based Task Thng / IDF20170001',
      properties: {},
      identifiers: {
        shortId: 'IDF20170001'
      },
    }];

    const expected = [{
      id: 'UpAVKdVNBMPNQrRRa2kdTgWd',
      createdAt: '6/28/2018, 11:07:09 AM',
      updatedAt: '6/28/2018, 11:07:09 AM',
      name: 'List Based Task Thng / IDF20170001',
      properties: {},
      identifiers: {
        shortId: 'IDF20170001'
      },
    }];

    const input = JSON.parse(JSON.stringify(original));
    await expand(input);
    expect(input[0].createdAt).to.be.a('string');
    expect(input[0].updatedAt).to.be.a('string');
  });

  it('should indent text', async () => {
    const input = '"name": "Some Thng name",';
    const expected = '  "name": "Some Thng name",';

    expect(indent(input, 2)).to.equal(expected);
  });
});

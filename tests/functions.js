const { expect } = require('chai');

const expand = require('../src/functions/expand');
const indent = require('../src/functions/indent');

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
      createdAt: '2018-6-28 11:07:09',
      updatedAt: '2018-6-28 11:07:09',
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
      createdAt: '2018-6-28 11:07:09',
      updatedAt: '2018-6-28 11:07:09',
      name: 'List Based Task Thng / IDF20170001',
      properties: {},
      identifiers: {
        shortId: 'IDF20170001'
      },
    }];

    const input = JSON.parse(JSON.stringify(original));
    await expand(input);
    expect(input).to.deep.equal(expected);
  });

  it('should indent text', async () => {
    const input = '"name": "Some Thng name",';
    const expected = '  "name": "Some Thng name",';

    expect(indent(input, 2)).to.equal(expected);
  });
});

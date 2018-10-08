/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { expect } = require('chai');
const _ = require('lodash');
const fs = require('fs');
const config = require('../../src/modules/config');
const csv = require('../../src/modules/csv');

const CSV_PATH = `${__dirname}/output.csv`;
const TEST_OBJECTS = [{
  id: 'U5GSbgP7KwddXtRRwkwxYgPq',
  name: 'Thng1',
  customFields: { foo: 'bar' },
  tags: ['some', 'tags'],
  product: 'UKGwQrgHq3shEqRaw2KyTt2n',
  identifiers: { dm: '8742278493' },
  properties: { color: 'red' },
}, {
  id: 'UpmSnYxUDDbasCwwRkRNQehq',
  name: 'Thng2',
  customFields: { baz: 123 },
  identifiers: { 'gs1:21': 4837289 },
}, {
  id: 'UK3x87gBpwAAXtawamsKRtmr',
  name: 'Thng3',
}];
const TEST_ROWS = [ 
  'id,name,tags,product,customFields.foo,customFields.baz,identifiers.dm,identifiers.gs1:21,properties.color',
  '"U5GSbgP7KwddXtRRwkwxYgPq","Thng1","some|tags","UKGwQrgHq3shEqRaw2KyTt2n","bar",,"8742278493",,"red"',
  '"UpmSnYxUDDbasCwwRkRNQehq","Thng2",,,,"123",,"4837289",',
  '"UK3x87gBpwAAXtawamsKRtmr","Thng3",,,,,,,',
];
const TEST_HEADERS = TEST_ROWS[0];

describe('csv', () => {
  after(async () => {
    fs.unlinkSync(CSV_PATH);
  });

  it('should convert objects to CSV rows', () => {
    const rows = csv.createCsvData(TEST_OBJECTS);
    expect(_.isEqual(rows, TEST_ROWS)).to.equal(true);
  });

  it('should not throw when writing to a CSV file', async () => {
    const writeCsvFile = () => csv.write(TEST_OBJECTS, CSV_PATH);
    expect(writeCsvFile).to.not.throw();
  });

  it('should have written the correct content to file', () => {
    const rows = fs.readFileSync(CSV_PATH, 'utf8').toString().split('\n');
    expect(rows).to.have.length(4);
    expect(rows[0]).to.equal(TEST_HEADERS);
    expect(rows[1]).to.equal(TEST_ROWS[1]);
    expect(rows[2]).to.equal(TEST_ROWS[2]);
    expect(rows[3]).to.equal(TEST_ROWS[3]);
  });

  it('should add a key to an object property', () => {
    const prefixKey = 'customFields.testKey';
    const [, realKey] = prefixKey.split('.');
    const testValue = 'testValue';
    const simpleObj = { customFields: {} };

    csv.addPrefixKeyToObject(simpleObj, 'customFields', prefixKey, testValue);
    expect(simpleObj.customFields[realKey]).to.equal(testValue);
  });

  it('should add a key to a non-existent object property', () => {
    const prefixKey = 'customFields.testKey';
    const [, realKey] = prefixKey.split('.');
    const testValue = 'testValue';
    const simpleObj = {};

    csv.addPrefixKeyToObject(simpleObj, 'customFields', prefixKey, testValue);
    expect(simpleObj.customFields).to.be.an('object');
    expect(simpleObj.customFields[realKey]).to.equal(testValue);
  });

  it('should convert a row into an object', () => {
    const object = csv.rowToObject(TEST_ROWS[1], TEST_HEADERS.split(','));
    const result = { 
      name: 'Thng1',
      tags: [ 'some', 'tags' ],
      customFields: { foo: 'bar' },
      product: 'UKGwQrgHq3shEqRaw2KyTt2n',
      properties: { color: 'red' },
      identifiers: { dm: '8742278493' },
    };

    expect(_.isEqual(object, result)).to.equal(true);
  });
});

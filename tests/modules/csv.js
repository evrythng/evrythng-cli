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
  collections: [
    'UH4nVsWVMG8EEqRawkMnybMh',
    'UHHHeHc5MGsYhqRawF6Hybgg',
  ],
  position: {
    type: 'Point',
    coordinates: [ -0.119123, 51.519435 ],
  },
  address: {
    street: 'East Road',
    city: 'London',
    countryCode: 'GB',
  },
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
  'id,name,tags,product,collections,position,address.street,address.city,address.countryCode,customFields.foo,customFields.baz,identifiers.dm,identifiers.gs1:21,properties.color',
  '"U5GSbgP7KwddXtRRwkwxYgPq","Thng1","some|tags","UKGwQrgHq3shEqRaw2KyTt2n","UH4nVsWVMG8EEqRawkMnybMh|UHHHeHc5MGsYhqRawF6Hybgg","-0.119123|51.519435","East Road","London","GB","bar",,"8742278493",,"red"',
  '"UpmSnYxUDDbasCwwRkRNQehq","Thng2",,,,,,,,,"123",,"4837289",',
  '"UK3x87gBpwAAXtawamsKRtmr","Thng3",,,,,,,,,,,,',
];

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
    expect(rows).to.have.length(TEST_ROWS.length);
    rows.forEach((item, i) => {
      expect(rows[i]).to.equal(TEST_ROWS[i]);
    });
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
    const object = csv.rowToObject(TEST_ROWS[1], TEST_ROWS[0].split(','));
    const expected = {
      name: 'Thng1',
      tags: [ 'some', 'tags' ],
      customFields: { foo: 'bar' },
      product: 'UKGwQrgHq3shEqRaw2KyTt2n',
      properties: { color: 'red' },
      identifiers: { dm: '8742278493' },
      collections: [
        'UH4nVsWVMG8EEqRawkMnybMh',
        'UHHHeHc5MGsYhqRawF6Hybgg',
      ],
      position: {
        type: 'Point',
        coordinates: [ -0.119123, 51.519435 ],
      },
      address: {
        street: 'East Road',
        city: 'London',
        countryCode: 'GB',
      },
    };
    expect(_.isEqual(object, expected)).to.equal(true);
  });
});

/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { expect } = require('chai');
const fs = require('fs');
const config = require('../../src/modules/config');
const csv = require('../../src/modules/csv');

const CSV_PATH = `${__dirname}/output.csv`;

describe('csv', () => {
  after(async () => {
    fs.unlinkSync(CSV_PATH);
  });

  it('should not throw writing a CSV file', async () => {
    const data = [
      { name: 'Thng1', customFields: { foo: 'bar' }, tags: ['some', 'tags'] },
      { name: 'Thng2', customFields: { baz: 123 }, identifiers: { 'gs1:21': 4837289 } },
      { name: 'Thng3' },
    ];
    const writeCsvFile = () => csv.toFile(data, CSV_PATH);
    expect(writeCsvFile).to.not.throw();

    const rows = fs.readFileSync(CSV_PATH, 'utf8').toString().split('\n');
    expect(rows).to.have.length(4);
    expect(rows[0]).to.equal('name,foo,baz,gs1:21,');
    expect(rows[1]).to.include(data[0].name);
    expect(rows[2]).to.include(data[1].customFields.baz);
  });
});

/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { expect } = require('chai');
const cli = require('../../src/functions/cli');
const http = require('../../src/modules/http');

describe('http', () => {
  it('should not throw when formatting headers', () => {
    const headers = {
      'access-control-allow-origin': '*',
      'access-control-expose-headers': 'Link, Location, X-Result-Count, X-Calculation-Date',
      'content-type': 'application/json',
      date: 'Tue, 18 Sep 2018 15:52:42 GMT',
      connection: 'close',
    };

    const format = () => http.formatHeaders(headers);
    expect(format).to.not.throw();
  });

  it('should not throw when printing a request object', () => {
    const req = {
      method: 'post',
      url: 'https://api.evrythng.com/thngs',
      displayHeaders: {
        'content-type': 'application/json',
        connection: 'close',
      },
      data: {
        name: 'Test Thng'
      }
    };

    const print = () => http.printRequest(req);
    expect(print).to.not.throw();
  });
});

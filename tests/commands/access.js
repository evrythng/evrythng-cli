/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { mockApi } = require('../util');
const cli = require('../../src/functions/cli');

describe('access', () => {
  it('should make correct request for \'access read\'', async () => {
    mockApi()
      .get('/access?perPage=30')
      .reply(200);

    await cli('access read');
  });
});

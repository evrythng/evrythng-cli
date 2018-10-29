/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { mockApi } = require('../util');
const cli = require('../../src/functions/cli');

describe('rate-limits', () => {
  it('should make correct request for \'rate-limits read\'', async () => {
    mockApi()
      .get('/rateLimits?perPage=30')
      .reply(200);

    await cli(`rate-limits read`);
  });
});

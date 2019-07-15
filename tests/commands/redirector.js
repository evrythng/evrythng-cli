/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { mockApi } = require('../util');
const cli = require('../../src/functions/cli');

describe('redirector', () => {
  it('should make correct request for \'redirector read\'', async () => {
    mockApi()
      .get('/redirector?perPage=30')
      .reply(200, {});

    await cli(`redirector read`);
  });

  it('should make correct request for \'redirector update $payload\'', async () => {
    const payload = JSON.stringify({
      rules: [{ match: 'thng.name=test', delegates: [] }],
    });
    mockApi()
      .put('/redirector', payload)
      .reply(200, {});

    await cli(`redirector update ${payload}`);
  });
});

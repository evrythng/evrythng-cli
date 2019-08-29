/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { ID, mockApi } = require('../util');
const cli = require('../../src/functions/cli');

describe('adi-orders', async () => {
  it('should make correct request for \'adi-orders create $payload\'', async () => {
    const payload = JSON.stringify({ name: 'Test batch' });
    mockApi()
      .post('/adis/orders', payload)
      .reply(201, {});

    await cli(`adi-orders create ${payload}`);
  });

  it('should make correct request for \'adi-orders $id read\'', async () => {
    mockApi()
      .get(`/adis/orders/${ID}`)
      .reply(200, {});

    await cli(`adi-orders ${ID} read`);
  });
});

/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { ID, mockApi } = require('../util');
const cli = require('../../src/functions/cli');

describe('accounts', () => {
  it('should make correct request for \'accounts list\'', async () => {
    mockApi()
      .get('/accounts?perPage=30')
      .reply(200, {});

    await cli('accounts list');
  });

  it('should make correct request for \'accounts $id read\'', async () => {
    mockApi()
      .get(`/accounts/${ID}`)
      .reply(200, {});

    await cli(`accounts ${ID} read`);
  });

  it('should make correct request for \'accounts $id update $payload\'', async () => {
    mockApi()
      .put(`/accounts/${ID}`)
      .reply(200, {});

    const payload = JSON.stringify({ imageUrl: '' });
    await cli(`accounts ${ID} update ${payload}`);
  });

  it('should make correct request for \'accounts $id accesses list\'', async () => {
    mockApi()
      .get(`/accounts/${ID}/accesses?perPage=30`)
      .reply(200, {});

    await cli(`accounts ${ID} accesses list`);
  });

  it('should make correct request for \'accounts $id accesses $id read\'', async () => {
    mockApi()
      .get(`/accounts/${ID}/accesses/${ID}`)
      .reply(200, {});

    await cli(`accounts ${ID} accesses ${ID} read`);
  });

  it('should make correct request for \'accounts $id accesses $id update $payload\'', async () => {
    mockApi()
      .put(`/accounts/${ID}/accesses/${ID}`)
      .reply(200, {});

    const payload = JSON.stringify({ role: ID });
    await cli(`accounts ${ID} accesses ${ID} update ${payload}`);
  });

  it('should make correct request for \'accounts $id domains list\'', async () => {
    mockApi()
      .get(`/accounts/${ID}/domains?perPage=30`)
      .reply(200, {});

    await cli(`accounts ${ID} domains list`);
  });

  it('should make correct request for \'accounts $id short-domains list\'', async () => {
    mockApi()
      .get(`/accounts/${ID}/shortDomains?perPage=30`)
      .reply(200, {});

    await cli(`accounts ${ID} short-domains list`);
  });
});

/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { ID, mockApi } = require('../util');
const cli = require('../../src/functions/cli');

describe('url', () => {
  it('should make correct request for \'url post $url $payload\'', async () => {
    const payload = JSON.stringify({ name: 'Test Thng' });
    mockApi()
      .post('/thngs', payload)
      .reply(201);
    
    await cli(`url post /thngs ${payload}`);
  });

  it('should make correct request for \'url get $url\'', async () => {
    mockApi()
      .get('/thngs?perPage=30')
      .reply(200);
    
    await cli('url get /thngs');
  });

  it('should make correct request for \'url put $url $payload\'', async () => {
    const payload = JSON.stringify({ name: 'Updated Thng' });
    mockApi()
      .put(`/thngs/${ID}`, payload)
      .reply(200);
    
    await cli(`url put /thngs/${ID} ${payload}`);
  });

  it('should make correct request for \'url delete $url\'', async () => {
    mockApi()
      .delete(`/thngs/${ID}`)
      .reply(200);
    
    await cli(`url delete /thngs/${ID}`);
  });
});

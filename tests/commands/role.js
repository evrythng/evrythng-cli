/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { ID, mockApi } = require('../util');
const cli = require('../../src/functions/cli');

describe('roles', () => {
  // Role CRUD
  it('should make correct request for \'roles create $payload\'', async () => {
    const payload = JSON.stringify({
      name: 'Test role',
      version: 2,
      type: 'userInApp',
    });
    mockApi()
      .post('/roles', payload)
      .reply(201, {});

    await cli(`roles create ${payload}`);
  });

  it('should make correct request for \'roles list\'', async () => {
    mockApi()
      .get('/roles?perPage=30')
      .reply(200, {});

    await cli('roles list');
  });

  it('should make correct request for \'roles $id read\'', async () => {
    mockApi()
      .get(`/roles/${ID}`)
      .reply(200, {});

    await cli(`roles ${ID} read`);
  });

  it('should make correct request for \'roles $id update $payload\'', async () => {
    const payload = JSON.stringify({ customFields: { key: 'value' } });
    mockApi()
      .put(`/roles/${ID}`, payload)
      .reply(200, {});

    await cli(`roles ${ID} update ${payload}`);
  });

  // Role Permissions
  it('should make correct request for \'roles $id permissions list\'', async () => {
    mockApi()
      .get(`/roles/${ID}/permissions?perPage=30`)
      .reply(200, {});

    await cli(`roles ${ID} permissions list`);
  });

  it('should make correct request for \'roles $id permissions update $payload\'', async () => {
    const payload = JSON.stringify([{ path: '/thngs', access: 'r' }]);
    mockApi()
      .put(`/roles/${ID}/permissions`, payload)
      .reply(200, {});

    await cli(`roles ${ID} permissions update ${payload}`);
  });

  // Finally
  it('should make correct request for \'roles $id delete\'', async () => {
    mockApi()
      .delete(`/roles/${ID}`)
      .reply(200, {});

    await cli(`roles ${ID} delete`);
  });
});
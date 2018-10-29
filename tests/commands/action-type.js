/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { mockApi } = require('../util');
const cli = require('../../src/functions/cli');

const NAME = 'scans';

describe('action-types', () => {
  it('should make correct request for \'action-types create $payload\'', async () => {
    const payload = JSON.stringify({ name: `_action-type-${Date.now()}` });
    mockApi()
      .post('/actions', payload)
      .reply(201);

    await cli(`action-types create ${payload}`);
  });

  it('should make correct request for \'action-types list\'', async () => {
    mockApi()
      .get('/actions?perPage=30')
      .reply(200);

    await cli('action-types list');
  });

  it('should make correct request for \'action-types $type update $payload\'', async () => {
    const payload = JSON.stringify({ description: 'Example action type' });
    mockApi()
      .put(`/actions/${NAME}`, payload)
      .reply(200);

    await cli(`action-types ${NAME} update ${payload}`);
  });

  it('should make correct request for \'action-types $type delete\'', async () => {
    mockApi()
      .delete(`/actions/${NAME}`)
      .reply(200);

    await cli(`action-types ${NAME} delete`);
  });
});

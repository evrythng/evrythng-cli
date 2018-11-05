/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { ID, NAME, mockApi } = require('../util');
const cli = require('../../src/functions/cli');

describe('thngs', () => {
  // Thng CRUD
  it('should make correct request for \'thngs create $payload\'', async () => {
    const payload = JSON.stringify({ name: 'Test thng' });
    mockApi()
      .post('/thngs', payload)
      .reply(201);

    await cli(`thngs create ${payload}`);
  });

  it('should make correct request for \'thngs list\'', async () => {
    mockApi()
      .get('/thngs?perPage=30')
      .reply(200);

    await cli('thngs list');
  });

  it('should make correct request for \'thngs $id read\'', async () => {
    mockApi()
      .get(`/thngs/${ID}`)
      .reply(200);

    await cli(`thngs ${ID} read`);
  });

  it('should make correct request for \'thngs $id update $payload\'', async () => {
    const payload = JSON.stringify({ tags: ['test'] });
    mockApi()
      .put(`/thngs/${ID}`, payload)
      .reply(200);

    await cli(`thngs ${ID} update ${payload}`);
  });

  // Thng properties
  it('should make correct request for \'thngs $id properties create $payload\'', async () => {
    const payload = JSON.stringify([{ key: NAME, value: 'some value' }]);
    mockApi()
      .put(`/thngs/${ID}/properties`, payload)
      .reply(200);

    await cli(`thngs ${ID} properties create ${payload}`);
  });

  it('should make correct request for \'thngs $id properties list\'', async () => {
    mockApi()
      .get(`/thngs/${ID}/properties?perPage=30`)
      .reply(200);

    await cli(`thngs ${ID} properties list`);
  });

  it('should make correct request for \'thngs $id properties $key read\'', async () => {
    mockApi()
      .get(`/thngs/${ID}/properties/${NAME}?perPage=30`)
      .reply(200);

    await cli(`thngs ${ID} properties ${NAME} read`);
  });

  it('should make correct request for \'thngs $id properties $key update $payload\'', async () => {
    const payload = JSON.stringify([{ value: 'some value' }]);
    mockApi()
      .put(`/thngs/${ID}/properties/${NAME}`, payload)
      .reply(200);

    await cli(`thngs ${ID} properties ${NAME} update ${payload}`);
  });

  it('should make correct request for \'thngs $id properties $key delete\'', async () => {
    mockApi()
      .delete(`/thngs/${ID}/properties/${NAME}`)
      .reply(200);

    await cli(`thngs ${ID} properties ${NAME} delete`);
  });

  // Thng actions
  it('should make correct request for \'thngs $id actions create $payload\'', async () => {
    const payload = JSON.stringify({ type: NAME });
    mockApi()
      .post(`/thngs/${ID}/actions/all`, payload)
      .reply(201);

    await cli(`thngs ${ID} actions create ${payload}`);
  });

  it('should make correct request for \'thngs $id actions list\'', async () => {
    mockApi()
      .get(`/thngs/${ID}/actions/all?perPage=30`)
      .reply(200);

    await cli(`thngs ${ID} actions list`);
  });

  it('should make correct request for \'thngs $id actions $id read\'', async () => {
    mockApi()
      .get(`/thngs/${ID}/actions/all/${ID}`)
      .reply(200);

    await cli(`thngs ${ID} actions ${ID} read`);
  });

  // Thng redirection
  it('should make correct request for \'thngs $id redirection create $payload\'', async () => {
    const payload = JSON.stringify({ defaultRedirectUrl: 'https://google.com/{shortId}/' });
    mockApi()
      .post(`/thngs/${ID}/redirector`, payload)
      .reply(201);

    await cli(`thngs ${ID} redirection create ${payload}`);
  });

  it('should make correct request for \'thngs $id redirection read\'', async () => {
    mockApi()
      .get(`/thngs/${ID}/redirector?perPage=30`)
      .reply(200);

    await cli(`thngs ${ID} redirection read`);
  });

  it('should make correct request for \'thngs $id redirection update $payload\'', async () => {
    const payload = JSON.stringify({ defaultRedirectUrl: 'https://google.com/{shortId}/updates/' });
    mockApi()
      .put(`/thngs/${ID}/redirector`, payload)
      .reply(200);

    await cli(`thngs ${ID} redirection update ${payload}`);
  });

  it('should make correct request for \'thngs $id redirection delete\'', async () => {
    mockApi()
      .delete(`/thngs/${ID}/redirector`)
      .reply(200);

    await cli(`thngs ${ID} redirection delete`);
  });

  // Thng location
  it('should make correct request for \'thngs $id location read\'', async () => {
    mockApi()
      .get(`/thngs/${ID}/location?perPage=30`)
      .reply(200);

    await cli(`thngs ${ID} location read`);
  });

  it('should make correct request for \'thngs $id location update $payload\'', async () => {
    const payload = JSON.stringify([{
      position: { type: 'Point', coordinates: [ -17.3, 36 ] },
    }]);
    mockApi()
      .put(`/thngs/${ID}/location`, payload)
      .reply(200);

    await cli(`thngs ${ID} location update ${payload}`);
  });

  it('should make correct request for \'thngs $id location delete\'', async () => {
    mockApi()
      .delete(`/thngs/${ID}/location`)
      .reply(200);

    await cli(`thngs ${ID} location delete`);
  });

  // Thng Device API Key
  it('should make correct request for \'thngs device-key create $payload\'', async () => {
    const payload = JSON.stringify({ thngId: ID });
    mockApi()
      .post('/auth/evrythng/thngs')
      .reply(201);

    await cli(`thngs device-key create ${payload}`);
  });

  it('should make correct request for \'thngs $id device-key read\'', async () => {
    const payload = JSON.stringify({ thngId: ID });
    mockApi()
      .get(`/auth/evrythng/thngs/${ID}`)
      .reply(200);

    await cli(`thngs ${ID} device-key read`);
  });

  it('should make correct request for \'thngs $id device-key delete\'', async () => {
    mockApi()
      .delete(`/auth/evrythng/thngs/${ID}`)
      .reply(200);

    await cli(`thngs ${ID} device-key delete`);
  });

  // Finally
  it('should make correct request for \'thngs $id delete\'', async () => {
    mockApi()
      .delete(`/thngs/${ID}`)
      .reply(200);

    await cli(`thngs ${ID} delete`);
  });
});

/**
 * (c) Copyright Reserved EVRYTHNG Limited 2019.
 * All rights reserved. Use of this material is subject to license.
 */

const { ID, mockApi } = require('../util');
const cli = require('../../src/functions/cli');

const shipmentNoticePayload = JSON.stringify({
  asnId: '9827429837429823828273',
  version: '1',
  issueDate: '2019-06-19T16:39:57-08:00',
  transportation: 'Expedited Freight',
  parties: [
    {
      id: 'gs1:414:01251',
      type: 'ship-from'
    },
    {
      name: 'The Landmark, Shop No. G14',
      type: 'ship-to',
      address: {
        street: '113-114, Central',
        city: 'Hong Kong'
      }
    }
  ],
  tags: [
    'ongoing',
    'important',
    'access-all'
  ]
});

const containerPayload = JSON.stringify({
  containerId: 'gs1:21:238467',
  transportationType: 'Pallet',
  products: [
    {
      id: 'gs1:01:000000001234',
      quantity: 562,
      unitOfMeasure: 'piece'
    }
  ],
  tags: [
    'ongoing',
    'important',
    'access-all'
  ]
});

describe('shipment-notices', async () => {
  it('should make correct request for \'shipment-notices create $payload\'', async () => {
    mockApi()
      .post('/shipmentNotices', shipmentNoticePayload)
      .reply(201, shipmentNoticePayload);

    await cli(`shipment-notices create ${shipmentNoticePayload}`);
  });

  it('should make correct request for \'shipment-notices $id read\'', async () => {
    mockApi()
      .get('/shipmentNotices/Ur2KGCnqbfsphqaabbcbsqnq')
      .reply(200, {});

    await cli(`shipment-notices Ur2KGCnqbfsphqaabbcbsqnq read`);
  });

  it('should make correct request for \'shipment-notices $id update $payload\'', async () => {
    mockApi()
      .put('/shipmentNotices/Ur2KGCnqbfsphqaabbcbsqnq', shipmentNoticePayload)
      .reply(200, shipmentNoticePayload);

    await cli(`shipment-notices Ur2KGCnqbfsphqaabbcbsqnq update ${shipmentNoticePayload}`);
  });

  it('should make correct request for \'shipment-notices $id delete\'', async () => {
    mockApi()
      .delete('/shipmentNotices/Ur2KGCnqbfsphqaabbcbsqnq')
      .reply(204);

    await cli(`shipment-notices Ur2KGCnqbfsphqaabbcbsqnq delete`);
  });
});

describe('shipment-notices containers', async () => {
  it('should make correct request for \'shipment-notices containers create $payload\'',
    async () => {
      mockApi()
        .post('/shipmentNotices/containers', containerPayload)
        .reply(201, containerPayload);

      await cli(`shipment-notices containers create ${containerPayload}`);
    });

  it('should make correct request for \'shipment-notices containers $id read\'', async () => {
    mockApi()
      .get('/shipmentNotices/containers/Ur2KGCnqbfsphqaabbcbsqnq')
      .reply(200, {});

    await cli(`shipment-notices containers Ur2KGCnqbfsphqaabbcbsqnq read`);
  });

  it('should make correct request for \'shipment-notices containers $id update $payload\'',
    async () => {
      mockApi()
        .put('/shipmentNotices/containers/Ur2KGCnqbfsphqaabbcbsqnq', containerPayload)
        .reply(200, containerPayload);

      await cli(`shipment-notices containers Ur2KGCnqbfsphqaabbcbsqnq update ${containerPayload}`);
    });

  it('should make correct request for \'shipment-notices containers $id delete\'', async () => {
    mockApi()
      .delete('/shipmentNotices/containers/Ur2KGCnqbfsphqaabbcbsqnq')
      .reply(204);

    await cli(`shipment-notices containers Ur2KGCnqbfsphqaabbcbsqnq delete`);
  });
});

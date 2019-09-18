/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { ID, mockApi } = require('../util');
const cli = require('../../src/functions/cli');

describe('adi-orders', async () => {
  it('should make correct request for \'adi-orders create $payload\'', async () => {
    const payload = JSON.stringify({
      ids: [
        'serial1',
        'serial2'
      ],
      purchaseOrder: '234567890',
      metadata: {
        identifierKey: 'gs1:21',
        customFields: {
          factory: '0400321'
        },
        product: 'gs1:01:9780345418913',
        tags: [
          'factory:0400321'
        ],
        shortDomain: 'tn.gg',
        defaultRedirectUrl: 'https://evrythng.com?id={shortId}'
      },
      identifiers: {
        internalId: 'X7JF'
      },
      tags: [
        'X7JF'
      ]
    });
    mockApi()
      .post('/adis/orders', payload)
      .reply(201, {});

    await cli(`adi-orders create ${payload}`);
  });

  it('should make correct request for \'adi-orders list\'', async () => {
    mockApi()
      .get('/adis/orders?perPage=30')
      .reply(200, {});

    await cli('adi-orders list');
  });

  it('should make correct request for \'adi-orders $id read\'', async () => {
    mockApi()
      .get(`/adis/orders/${ID}`)
      .reply(200, {});

    await cli(`adi-orders ${ID} read`);
  });

  it('should make correct request for \'adi-orders $id events create $payload\'', async () => {
    const payload = JSON.stringify({
      metadata: {
        type: 'encodings',
        tags: ['example']
      },
      ids: [
        'serial1',
        'serial2'
      ],
      customFields: {
        internalId: 'X7JF'
      },
      tags: ['X7JF']
    });
    mockApi()
      .post(`/adis/orders/${ID}/events`, payload)
      .reply(201, {});

    await cli(`adi-orders ${ID} events create ${payload}`);
  });

  it('should make correct request for \'adi-orders $id events list\'', async () => {
    mockApi()
      .get(`/adis/orders/${ID}/events?perPage=30`)
      .reply(200, {});

    await cli(`adi-orders ${ID} events list`);
  });

  it('should make correct request for \'adi-orders $id events $eventId read\'', async () => {
    mockApi()
      .get(`/adis/orders/${ID}/events/${ID}`)
      .reply(200, {});

    await cli(`adi-orders ${ID} events ${ID} read`);
  });
});

/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const sinon = require('sinon');
const { ID, mockApi } = require('../util');
const cli = require('../../src/functions/cli');
const file = require('../../src/commands/file');

const FILE_NAME = 'test.txt';
const FILE_TYPE = 'text/plain';

describe('files', () => {
  after(() => sinon.restore());

  it('should make correct request for \'files create $payload\'', async () => {
    const payload = JSON.stringify({
      name: 'test.txt',
      type: 'text/plain',
      privateAccess: false,
    });
    mockApi()
      .post('/files', payload)
      .reply(201, {});

    await cli(`files create ${payload}`);
  });

  it('should make correct request for \'files list\'', async () => {
    mockApi()
      .get('/files?perPage=30')
      .reply(200, {});

    await cli('files list');
  });

  it('should make correct request for \'files $id read\'', async () => {
    mockApi()
      .get(`/files/${ID}`)
      .reply(200, {});

    await cli(`files ${ID} read`);
  });

  it('should make correct request for \'files $id upload $file-path $mime-type\'', async () => {
    mockApi()
      .get(`/files/${ID}`)
      .reply(200, { name: FILE_NAME, type: FILE_TYPE });

    sinon.stub(file, 'uploadToS3').returns(true);

    await cli(`files ${ID} upload ./tests/${FILE_NAME} ${FILE_TYPE}`);
  });

  it('should make correct request for \'files $id delete\'', async () => {
    mockApi()
      .delete(`/files/${ID}`)
      .reply(200, {});

    await cli(`files ${ID} delete`);
  });
});
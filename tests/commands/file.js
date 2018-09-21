/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { expect } = require('chai');
const { ctx } = require('../util');
const cli = require('../../src/functions/cli');

describe('files', () => {
  it('should return 201 for \'files create $payload\'', async () => {
    const payload = JSON.stringify({
      name: 'test.txt',
      type: 'text/plain',
      privateAccess: false,
    });
    const res = await cli(`files create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.fileId = res.data.id;
  });

  it('should return 200 for \'files list\'', async () => {
    const res = await cli('files list');

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'files $id read\'', async () => {
    const res = await cli(`files ${ctx.fileId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should not throw error for \'files $id upload $file-path $mime-type\'', async () => {
    const uploadTestFile = async () => cli(`files ${ctx.fileId} upload ./tests/test.txt text/plain`);

    expect(uploadTestFile).to.not.throw();
  });

  it('should return 200 for \'files $id delete\'', async () => {
    const res = await cli(`files ${ctx.fileId} delete`);

    expect(res.status).to.equal(200);
  });
});
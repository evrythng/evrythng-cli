const { expect } = require('chai');

const { ctx } = require('../modules/util');
const cli = require('../../src/functions/cli');

describe('file', () => {
  it('should return 201 for \'file create $payload\'', async () => {
    const payload = JSON.stringify({ 
      name: 'test.txt', 
      type: 'text/plain', 
      privateAccess: false,
    });
    const res = await cli(`file create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.fileId = res.data.id;
  });

  it('should return 200 for \'file list\'', async () => {
    const res = await cli('file list');

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'file $id read\'', async () => {
    const res = await cli(`file ${ctx.fileId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should not throw error for \'file $id upload $file-path $mime-type\'', async () => {
    const uploadTestFile = async () => cli(`file ${ctx.fileId} upload ./tests/modules/test.txt text/plain`);
   
    expect(uploadTestFile).to.not.throw();
  });

  it('should return 200 for \'file $id delete\'', async () => {
    const res = await cli(`file ${ctx.fileId} delete`);

    expect(res.status).to.equal(200);
  });
});
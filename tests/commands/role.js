const { expect } = require('chai');
const { ctx } = require('../modules/util');
const cli = require('../../src/functions/cli');

describe('role', () => {
  // Role CRUD
  it('should return 201 for \'role create $payload\'', async () => {
    const payload = JSON.stringify({ 
      name: 'Test role', 
      version: 2,
      type: 'userInApp',
    });
    const res = await cli(`role create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.roleId = res.data.id;
  });

  it('should return 200 for \'role list\'', async () => {
    const res = await cli('role list');

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'role $id read\'', async () => {
    const res = await cli(`role ${ctx.roleId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'role $id update $payload\'', async () => {
    const payload = JSON.stringify({ customFields: { key: 'value' } });
    const res = await cli(`role ${ctx.roleId} update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  // Role Permissions
  it('should return 200 for \'role $id permission list\'', async () => {
    const res = await cli(`role ${ctx.roleId} permission list`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'role $id permission update $payload\'', async () => {
    const payload = JSON.stringify([{ path: '/thngs', access: 'r' }]);
    const res = await cli(`role ${ctx.roleId} permission update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  // Finally
  it('should return 200 for \'role $id delete\'', async () => {
    const res = await cli(`role ${ctx.roleId} delete`);

    expect(res.status).to.equal(200);
  });
});
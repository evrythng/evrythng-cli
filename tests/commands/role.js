/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { expect } = require('chai');
const { ctx } = require('../util');
const cli = require('../../src/functions/cli');

describe('roles', () => {
  // Role CRUD
  it('should return 201 for \'roles create $payload\'', async () => {
    const payload = JSON.stringify({
      name: 'Test role',
      version: 2,
      type: 'userInApp',
    });
    const res = await cli(`roles create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.roleId = res.data.id;
  });

  it('should return 200 for \'roles list\'', async () => {
    const res = await cli('roles list');

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'roles $id read\'', async () => {
    const res = await cli(`roles ${ctx.roleId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'roles $id update $payload\'', async () => {
    const payload = JSON.stringify({ customFields: { key: 'value' } });
    const res = await cli(`roles ${ctx.roleId} update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  // Role Permissions
  it('should return 200 for \'roles $id permissions list\'', async () => {
    const res = await cli(`roles ${ctx.roleId} permissions list`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'roles $id permissions update $payload\'', async () => {
    const payload = JSON.stringify([{ path: '/thngs', access: 'r' }]);
    const res = await cli(`roles ${ctx.roleId} permissions update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  // Finally
  it('should return 200 for \'roles $id delete\'', async () => {
    const res = await cli(`roles ${ctx.roleId} delete`);

    expect(res.status).to.equal(200);
  });
});
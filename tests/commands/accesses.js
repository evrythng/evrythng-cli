/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { expect } = require('chai');
const { ctx, createAppUser, createProject, createApplication } = require('../util');
const cli = require('../../src/functions/cli');
const operator = require('../../src/commands/operator');
const switches = require('../../src/modules/switches');

describe('accesses', () => {
  before(async () => {
    // Create project and application
    ctx.project = await createProject();
    ctx.application = await createApplication(ctx.project.id);

    // Create Application Users for authentication and access sharing
    ctx.appUser1 = await createAppUser('user1');
    ctx.appUser2 = await createAppUser('user2');
  });

  after(async () => {
    await cli(`app-users ${ctx.appUser1.evrythngUser} delete`);
    await cli(`app-users ${ctx.appUser2.evrythngUser} delete`);
    await cli(`projects ${ctx.project.id} delete`);
  });

  it('should return 201 for \'accesses create $payload\'', async () => {
    const payload = JSON.stringify({
      email: `user2@example.com`,
      role: 'base_app_user',
    });
    const res = await cli(`accesses create ${payload} --api-key ${ctx.appUser1.evrythngApiKey}`);
    switches.API_KEY = false;

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.accessId = res.data.id;
  });

  it('should return 200 for \'accesses list\'', async () => {
    const res = await cli(`accesses list --api-key ${ctx.appUser1.evrythngApiKey}`);
    switches.API_KEY = false;

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 204 for \'accesses delete\'', async () => {
    const argStr = `accesses ${ctx.accessId} delete --api-key ${ctx.appUser1.evrythngApiKey}`;
    const res = await cli(argStr);
    switches.API_KEY = false;

    expect(res.status).to.equal(204);
  });
});

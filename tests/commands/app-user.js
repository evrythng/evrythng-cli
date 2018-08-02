/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { expect } = require('chai');
const { ctx, createProject, createApplication } = require('../modules/util');
const cli = require('../../src/functions/cli');
const switches = require('../../src/modules/switches');

const APP_USER = {
  firstName: 'test',
  lastName: 'user',
  email: 'test-user@test.com',
  password: 'password',
};

describe('app-users', () => {
  before(async () => {
    ctx.project = await createProject();
    ctx.application = await createApplication(ctx.project.id);
  });

  after(async () => {
    await cli(`projects ${ctx.project.id} delete`);
  });

  it('should return 201 for \'app-users create $payload\'', async () => {
    const payload = JSON.stringify(APP_USER);
    const res = await cli(`app-users create ${payload} --api-key ${ctx.application.appApiKey}`);
    switches.unset(switches.API_KEY);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.evrythngUser = res.data.evrythngUser;
    ctx.activationCode = res.data.activationCode;
  });

  it('should return 201 for \'app-users $id validate $payload\'', async () => {
    const payload = JSON.stringify({ activationCode: ctx.activationCode });
    const argStr = `app-users ${ctx.evrythngUser} validate ${payload} --api-key ${ctx.application.appApiKey}`;
    const res = await cli(argStr);
    switches.unset(switches.API_KEY);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.evrythngApiKey = res.data.evrythngApiKey;
  });

  it('should return 201 for \'app-users anonymous create\'', async () => {
    const res = await cli(`app-users anonymous create --api-key ${ctx.application.appApiKey}`);
    switches.unset(switches.API_KEY);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'app-users list\'', async () => {
    const res = await cli('app-users list');

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'app-users $id read\'', async () => {
    const res = await cli(`app-users ${ctx.evrythngUser} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'app-users $id update $payload\'', async () => {
    const payload = JSON.stringify({ firstName: 'Test '});
    const res = await cli(`app-users ${ctx.evrythngUser} update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'app-users login $payload\'', async () => {
    const payload = JSON.stringify({
      email: APP_USER.email,
      password: APP_USER.password,
    });
    const res = await cli(`app-users login ${payload} --api-key ${ctx.application.appApiKey}`);
    switches.unset(switches.API_KEY);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 201 for \'app-users logout\'', async () => {
    const res = await cli(`app-users logout --api-key ${ctx.evrythngApiKey}`);
    switches.unset(switches.API_KEY);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'app-users $id delete\'', async () => {
    const res = await cli(`app-users ${ctx.evrythngUser} delete`);

    expect(res.status).to.equal(200);
  });
});

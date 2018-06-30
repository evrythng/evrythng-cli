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

describe('app-user', () => {
  before(async () => {
    ctx.project = await createProject();
    ctx.application = await createApplication(ctx.project.id);
  });

  after(async () => {
    await cli(`project ${ctx.project.id} delete`);
  });

  it('should return 201 for \'app-user create $payload\'', async () => {
    const payload = JSON.stringify(APP_USER);
    const res = await cli(`app-user create ${payload} --api-key ${ctx.application.appApiKey}`);
    switches.unset(switches.API_KEY);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.evrythngUser = res.data.evrythngUser;
    ctx.activationCode = res.data.activationCode;
  });

  it('should return 201 for \'app-user $id validate $payload\'', async () => {
    const payload = JSON.stringify({ activationCode: ctx.activationCode });
    const argStr = `app-user ${ctx.evrythngUser} validate ${payload} --api-key ${ctx.application.appApiKey}`;
    const res = await cli(argStr);
    switches.unset(switches.API_KEY);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.evrythngApiKey = res.data.evrythngApiKey;
  });

  it('should return 201 for \'app-user anonymous create\'', async () => {
    const res = await cli(`app-user anonymous create --api-key ${ctx.application.appApiKey}`);
    switches.unset(switches.API_KEY);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'app-user list\'', async () => {
    const res = await cli('app-user list');

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'app-user $id read\'', async () => {
    const res = await cli(`app-user ${ctx.evrythngUser} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'app-user $id update $payload\'', async () => {
    const payload = JSON.stringify({ firstName: 'Test '});
    const res = await cli(`app-user ${ctx.evrythngUser} update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'app-user login $payload\'', async () => {
    const payload = JSON.stringify({
      email: APP_USER.email,
      password: APP_USER.password,
    });
    const res = await cli(`app-user login ${payload} --api-key ${ctx.application.appApiKey}`);
    switches.unset(switches.API_KEY);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 201 for \'app-user logout\'', async () => {
    const res = await cli(`app-user logout --api-key ${ctx.evrythngApiKey}`);
    switches.unset(switches.API_KEY);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'app-user $id delete\'', async () => {
    const res = await cli(`app-user ${ctx.evrythngUser} delete`);

    expect(res.status).to.equal(200);
  });
});

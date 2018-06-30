const { expect } = require('chai');

const { ctx } = require('../modules/util');
const cli = require('../../src/functions/cli');

describe('project', () => {
  // Project CRUD
  it('should return 201 for \'project create $payload\'', async () => {
    const payload = JSON.stringify({ name: 'Test project' });
    const res = await cli(`project create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.projectId = res.data.id;
  });

  it('should return 200 for \'project list\'', async () => {
    const res = await cli('project list');

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'project $id read\'', async () => {
    const res = await cli(`project ${ctx.projectId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'project $id update $payload\'', async () => {
    const payload = JSON.stringify({ tags: ['test'] });
    const res = await cli(`project ${ctx.projectId} update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  // Applications CRUD
  it('should return 200 for \'project $id application create $payload\'', async () => {
    const payload = JSON.stringify({ name: 'Test application', socialNetworks: {} });
    const res = await cli(`project ${ctx.projectId} application create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.appId = res.data.id;
  });

  it('should return 200 for \'project $id application list\'', async () => {
    const res = await cli(`project ${ctx.projectId} application list`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'project $id application $id read\'', async () => {
    const res = await cli(`project ${ctx.projectId} application ${ctx.appId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'project $id application $id update $payload\'', async () => {
    const payload = JSON.stringify({ description: 'Updated application' });
    const res = await cli(`project ${ctx.projectId} application ${ctx.appId} update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  // Trusted API Key
  it('should return 200 for \'project $id application $id secret-key read\'', async () => {
    const res = await cli(`project ${ctx.projectId} application ${ctx.appId} secret-key read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  // Application Redirector
  it('should return 200 for \'project $id application $id redirector read\'', async () => {
    const res = await cli(`project ${ctx.projectId} application ${ctx.appId} redirector read`);    

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'project $id application $id redirector update $payload\'', async () => {
    const payload = JSON.stringify({
      rules: [{ match: 'thng.name=test', redirectUrl: 'https://evrythng.com' }],
    });
    const argStr = `project ${ctx.projectId} application ${ctx.appId} redirector update ${payload}`;
    const res = await cli(argStr);    

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  // Application Reactor
  it('should return 200 for \'project $id application $id reactor script read\'', async () => {
    const argStr = `project ${ctx.projectId} application ${ctx.appId} reactor script read`;
    const res = await cli(argStr);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'project $id application $id reactor script update $payload\'', async () => {
    const payload = JSON.stringify({
      script: 'function onActionCreated(event) {\n logger.debug(\'Hello World!\');\n done();}',
    });
    const argStr = `project ${ctx.projectId} application ${ctx.appId} reactor script update ${payload}`;
    const res = await cli(argStr);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'project $id application $id reactor script status read\'', async () => {
    const argStr = `project ${ctx.projectId} application ${ctx.appId} reactor script status read`;
    const res = await cli(argStr);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'project $id application $id reactor logs read\'', async () => {
    const argStr = `project ${ctx.projectId} application ${ctx.appId} reactor logs read`;
    const res = await cli(argStr);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'project $id application $id reactor logs delete\'', async () => {
    const argStr = `project ${ctx.projectId} application ${ctx.appId} reactor logs delete`;
    const res = await cli(argStr);

    expect(res.status).to.equal(200);
  });

  it('should return 201 for \'project $id application $id reactor schedule create $payload\'', async () => {
    const payload = JSON.stringify({ event: {}, executeAt: Date.now() + 60000 });
    const argStr = `project ${ctx.projectId} application ${ctx.appId} reactor schedule create ${payload}`;
    const res = await cli(argStr);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.scheduleId = res.data.id;
  });

  it('should return 200 for \'project $id application $id reactor schedule list\'', async () => {
    const argStr = `project ${ctx.projectId} application ${ctx.appId} reactor schedule list`;
    const res = await cli(argStr);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'project $id application $id reactor schedule $id read\'', async () => {
    const argStr = `project ${ctx.projectId} application ${ctx.appId} reactor schedule ${ctx.scheduleId} read`;
    const res = await cli(argStr);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'project $id application $id reactor schedule $id update $payload\'', async () => {
    const payload = JSON.stringify({ description: 'Updated schedule' });
    const argStr = `project ${ctx.projectId} application ${ctx.appId} reactor schedule ${ctx.scheduleId} update ${payload}`;
    const res = await cli(argStr);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'project $id application $id reactor schedule $id delete\'', async () => {
    const argStr = `project ${ctx.projectId} application ${ctx.appId} reactor schedule ${ctx.scheduleId} delete`;
    const res = await cli(argStr);

    expect(res.status).to.equal(200);
  });

  // Finally
  it('should return 200 for \'project $id application $id delete\'', async () => {
    const res = await cli(`project ${ctx.projectId} application ${ctx.appId} delete`);

    expect(res.status).to.equal(200);
  });

  it('should return 200 for \'project $id delete\'', async () => {
    const res = await cli(`project ${ctx.projectId} delete`);

    expect(res.status).to.equal(200);
  });
});
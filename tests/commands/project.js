/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { expect } = require('chai');
const { ctx } = require('../util');
const cli = require('../../src/functions/cli');

describe('projects', () => {
  // Project CRUD
  it('should return 201 for \'projects create $payload\'', async () => {
    const payload = JSON.stringify({ name: 'Test project' });
    const res = await cli(`projects create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.projectId = res.data.id;
  });

  it('should return 200 for \'projects list\'', async () => {
    const res = await cli('projects list');

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'projects $id read\'', async () => {
    const res = await cli(`projects ${ctx.projectId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'projects $id update $payload\'', async () => {
    const payload = JSON.stringify({ tags: ['test'] });
    const res = await cli(`projects ${ctx.projectId} update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  // Applications CRUD
  it('should return 200 for \'projects $id applications create $payload\'', async () => {
    const payload = JSON.stringify({ name: 'Test application', socialNetworks: {} });
    const res = await cli(`projects ${ctx.projectId} applications create ${payload}`);

    expect(res.status).to.equal(201);
    expect(res.data).to.be.an('object');

    ctx.appId = res.data.id;
  });

  it('should return 200 for \'projects $id applications list\'', async () => {
    const res = await cli(`projects ${ctx.projectId} applications list`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'projects $id applications $id read\'', async () => {
    const res = await cli(`projects ${ctx.projectId} applications ${ctx.appId} read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'projects $id applications $id update $payload\'', async () => {
    const payload = JSON.stringify({ description: 'Updated application' });
    const res = await cli(`projects ${ctx.projectId} applications ${ctx.appId} update ${payload}`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  // Trusted API Key
  it('should return 200 for \'projects $id applications $id secret-key read\'', async () => {
    const res = await cli(`projects ${ctx.projectId} applications ${ctx.appId} secret-key read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  // Application Redirector
  it('should return 200 for \'projects $id applications $id redirector read\'', async () => {
    const res = await cli(`projects ${ctx.projectId} applications ${ctx.appId} redirector read`);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'projects $id applications $id redirector update $payload\'',
    async () => {
      const payload = JSON.stringify({
        rules: [{ match: 'thng.name=test', redirectUrl: 'https://evrythng.com' }],
      });
      const argStr = `projects ${ctx.projectId} applications ${ctx.appId} redirector update ${payload}`;
      const res = await cli(argStr);

      expect(res.status).to.equal(200);
      expect(res.data).to.be.an('object');
    });

  // Application Reactor
  it('should return 200 for \'projects $id applications $id reactor script read\'', async () => {
    const argStr = `projects ${ctx.projectId} applications ${ctx.appId} reactor script read`;
    const res = await cli(argStr);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
  });

  it('should return 200 for \'projects $id applications $id reactor script update $payload\'',
    async () => {
      const payload = JSON.stringify({
        script: 'function onActionCreated(event) {\n logger.debug(\'Hello World!\');\n done();}',
      });
      const argStr = `projects ${ctx.projectId} applications ${ctx.appId} reactor script update ${payload}`;
      const res = await cli(argStr);

      expect(res.status).to.equal(200);
      expect(res.data).to.be.an('object');
    });

  it('should return 200 for \'projects $id applications $id reactor script status read\'',
    async () => {
      const argStr = `projects ${ctx.projectId} applications ${ctx.appId} reactor script status read`;
      const res = await cli(argStr);

      expect(res.status).to.equal(200);
      expect(res.data).to.be.an('object');
    });

  it('should return 200 for \'projects $id applications $id reactor logs read\'', async () => {
    const argStr = `projects ${ctx.projectId} applications ${ctx.appId} reactor logs read`;
    const res = await cli(argStr);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'projects $id applications $id reactor logs delete\'', async () => {
    const argStr = `projects ${ctx.projectId} applications ${ctx.appId} reactor logs delete`;
    const res = await cli(argStr);

    expect(res.status).to.equal(200);
  });

  it('should return 201 for \'projects $id applications $id reactor schedules create $payload\'',
    async () => {
      const payload = JSON.stringify({ event: {}, executeAt: Date.now() + 60000 });
      const argStr = `projects ${ctx.projectId} applications ${ctx.appId} reactor schedules create ${payload}`;
      const res = await cli(argStr);

      expect(res.status).to.equal(201);
      expect(res.data).to.be.an('object');

      ctx.scheduleId = res.data.id;
    });

  it('should return 200 for \'projects $id applications $id reactor schedules list\'', async () => {
    const argStr = `projects ${ctx.projectId} applications ${ctx.appId} reactor schedules list`;
    const res = await cli(argStr);

    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('array');
  });

  it('should return 200 for \'projects $id applications $id reactor schedules $id read\'',
    async () => {
      const argStr = `projects ${ctx.projectId} applications ${ctx.appId} reactor schedules ${ctx.scheduleId} read`;
      const res = await cli(argStr);

      expect(res.status).to.equal(200);
      expect(res.data).to.be.an('object');
    });

  it(
    'should return 200 for \'projects $id applications $id reactor schedules $id update $payload\'',
    async () => {
      const payload = JSON.stringify({ description: 'Updated schedule' });
      const argStr = `projects ${ctx.projectId} applications ${ctx.appId} reactor schedules ${ctx.scheduleId} update ${payload}`;
      const res = await cli(argStr);

      expect(res.status).to.equal(200);
      expect(res.data).to.be.an('object');
    });

  it('should return 200 for \'projects $id applications $id reactor schedules $id delete\'',
    async () => {
      const argStr = `projects ${ctx.projectId} applications ${ctx.appId} reactor schedules ${ctx.scheduleId} delete`;
      const res = await cli(argStr);

      expect(res.status).to.equal(200);
    });

  // Finally
  it('should return 200 for \'projects $id applications $id delete\'', async () => {
    const res = await cli(`projects ${ctx.projectId} applications ${ctx.appId} delete`);

    expect(res.status).to.equal(200);
  });

  it('should return 200 for \'projects $id delete\'', async () => {
    const res = await cli(`projects ${ctx.projectId} delete`);

    expect(res.status).to.equal(200);
  });
});
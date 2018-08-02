/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const cli = require('../../src/functions/cli');
const switches = require('../../src/modules/switches');

const ctx = {};

const waitAsync = async ms => new Promise(resolve => setTimeout(resolve, ms));

const createProject = async () => {
  const payload = JSON.stringify({ name: 'Test project' });
  const res = await cli(`projects create ${payload}`);

  return res.data;
};

const createApplication = async (projectId) => {
  const payload = JSON.stringify({ name: 'Test app', socialNetworks: {} });
  const res = await cli(`projects ${projectId} applications create ${payload}`);

  return res.data;
};

const createAppUser = async (name) => {
  let payload = JSON.stringify({
    firstName: 'test',
    lastName: 'user',
    email: `${name}@example.com`,
    password: 'password',
  });
  let res = await cli(`app-users create ${payload} --api-key ${ctx.application.appApiKey}`);
  switches.unset(switches.API_KEY);

  // Validate Application User
  payload = JSON.stringify({ activationCode: res.data.activationCode });
  const argStr = `app-users ${res.data.evrythngUser} validate ${payload} --api-key ${ctx.application.appApiKey}`;
  res = await cli(argStr);
  switches.unset(switches.API_KEY);
  return res.data;
};

module.exports = {
  ctx,
  waitAsync,
  createAppUser,
  createProject,
  createApplication,
};

/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const _  = require('lodash');
const sinon = require('sinon');
const nock = require('nock');
const config = require('../src/modules/config');
const cli = require('../src/functions/cli');
const http = require('../src/modules/http');
const operator = require('../src/commands/operator');
const switches = require('../src/modules/switches');

const ctx = {};

/** Fake ID */
const ID = '012345678901234567890123';

/** Fake API key */
const API_KEY = '01234567890123456789012345678901234567890123456789012345678901234567890123456789';

/** Fake name for action types, property keys, etc. */
const NAME = 'scans';

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
  switches.API_KEY = false;

  // Validate Application User
  payload = JSON.stringify({ activationCode: res.data.activationCode });
  const argStr = `app-users ${res.data.evrythngUser} validate ${payload} --api-key ${ctx.application.appApiKey}`;
  res = await cli(argStr);
  switches.API_KEY = false;
  return res.data;
};

/**
 * Validate a CLI command string produces an API request. Quicker than an E2E test.
 *
 * @param {String} argStr - The CLI command, such as 'thngs list'.
 * @param {Object} spec - The expected options produced by sendRequest.
 * @param {String} apiKey - API key to use as the authorization header value, if not the Operator.
 * @returns {Promise} A Promise that resolves when Sinon hears the call from http.js
 */
const validateRequest = (argStr, spec, apiKey) => new Promise((resolve, reject) => {
  apiKey = apiKey || operator.getKey();

  // Add extra fields not required for the test spec
  Object.assign(spec, {
    fullResponse: true,
    authorization: apiKey,
    displayHeaders: { Authorization: `${apiKey.slice(0, 4)}...` },
  });

  // Add listener for options produced by CLI command
  sinon.stub(http, 'sendRequest').callsFake((options) => {
    if (!_.isEqual(options, spec)) {
      reject(`Options did not match spec: ${JSON.stringify(options)}`);
      return;
    }

    resolve();
  });

  // Invoke the command for Sinon to listen for
  cli(argStr);
});

/**
 * Prepare nock for an API request.
 *
 * @param {boolean} allowUnmocked - Allow nock to make unmocked requests to the API.
 * @returns {Object} nock scope object.
 */
const mockApi = (allowUnmocked = false) => {
  const regions = config.get('regions');
  const { region } = config.get('operators')[config.get('using')];
  return nock(regions[region], { allowUnmocked });
};

module.exports = {
  ctx,
  waitAsync,
  createAppUser,
  createProject,
  createApplication,
  validateRequest,
  mockApi,
  ID,
  API_KEY,
  NAME,
};

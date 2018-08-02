/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { validate } = require('jsonschema');
const fs = require('fs');

const PATH = `${require('os').homedir()}/.evrythng-cli-config`;

const DEFAULT_CONFIG = {
  using: '',
  operators: {},
  options: {
    errorDetail: false,
    noConfirm: true,
    showHttp: false,
    logLevel: 'info',
  },
  regions: {
    us: 'https://api.evrythng.com',
    eu: 'https://api-eu.evrythng.com',
  },
};

const CONFIG_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['using', 'operators', 'options', 'regions'],
  properties: {
    using: { type: 'string' },
    operators: {
      type: 'object',
      patternProperties: {
        '(.*)': {
          type: 'object',
          additionalProperties: false,
          required: ['apiKey', 'region'],
          properties: {
            apiKey: {
              type: 'string',
              minLength: 80,
              maxLength: 80,
            },
            region: { type: 'string' },
          },
        },
      },
    },
    options: {
      type: 'object',
      additionalProperties: false,
      required: ['errorDetail', 'noConfirm', 'showHttp', 'logLevel'],
      properties: {
        errorDetail: { type: 'boolean' },
        noConfirm: { type: 'boolean' },
        showHttp: { type: 'boolean' },
        logLevel: {
          type: 'string',
          enum: ['info', 'error'],
        },
      },
    },
    regions: { type: 'object' },
  },
};

let data;

const validateConfig = (input) => {
  let results = validate(input, CONFIG_SCHEMA);
  if (results.errors && results.errors.length) {
    results = results.errors.map(item => item.stack);

    throw new Error(`\nConfiguration is invalid:\n- ${results.join('\n- ')}`);
  }
};

const write = () => fs.writeFileSync(PATH, JSON.stringify(data, null, 2), 'utf8');

const load = () => {
  if (!fs.existsSync(PATH)) {
    data = DEFAULT_CONFIG;
    write();
    return;
  }

  data = JSON.parse(fs.readFileSync(PATH, 'utf8'));
  validateConfig(data);
};

const get = key => data[key];

const set = (key, value) => {
  data[key] = value;
  write();
};

module.exports = {
  PATH,
  get,
  set,
  validateConfig,
};

load();

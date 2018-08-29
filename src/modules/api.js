/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const fs = require('fs');
const { validate } = require('./util');
const commands = require('./commands');
const config = require('./config');
const switches = require('./switches');

const PREFIX = 'evrythng-cli-plugin-';

// Read node_modules alongside CLI
const NODE_MODULES_PATH = `${__dirname}/../../../`;

const COMMAND_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  requried: ['about', 'firstArg', 'operations'],
  properties: {
    about: { type: 'string' },
    firstArg: { type: 'string' },
    operations: {
      type: 'object',
      patternProperties: {
        '[.*?]*': {
          type: 'object',
          additionalProperties: false,
          requried: ['pattern', 'execute'],
          properties: {
            pattern: { type: 'string' },
            execute: { type: 'any' },
          },
        },
      },
    },
  },
};

const API = {
  addCommand: (command) => {
    const errors = validate(command, COMMAND_SCHEMA);
    if (errors.length) {
      throw new Error(`Invalid command object: ${JSON.stringify(errors)}`);
    }

    commands.COMMAND_LIST.push(command);
  },
  getOptions: () => config.get('options'),
  getSwitches: () => switches.exported,
};

const loadPlugins = () => {
  fs.readdirSync(NODE_MODULES_PATH)
    .filter(item => item.startsWith(PREFIX))
    .forEach((item) => {
      try {
        require(`${NODE_MODULES_PATH}/${item}`)(API);
      } catch (e) {
        throw new Error(`Failed to load plugin: ${item}`);
      }
    });
};

module.exports = {
  loadPlugins,
};

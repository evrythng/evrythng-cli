/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const fs = require('fs');
const { validate } = require('./util');
const commands = require('./commands');
const config = require('./config');
const operator = require('../commands/operator');
const switches = require('./switches');

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
            execute: { type: 'any' },
            pattern: { type: 'string' },
            helpPattern: { type: 'string' },
          },
        },
      },
    },
  },
};

// Read node_modules alongside CLI
const NODE_MODULES_PATH = `${__dirname}/../../../`;
const PREFIX = 'evrythng-cli-plugin-';

/**
 * Run a list of args as a command.
 *
 * @param {string[]} args - The args to identify and run.
 */
const runCommand = async (args) => {
  const command = commands.identify(args);
  if (!command) {
    throw new Error(`Command '${args.join(' ')}' was not recognised.`);
  }

  operator.applyRegion();
  await command.execute(args.slice(1));
};

const API = {
  registerCommand: (command) => {
    const errors = validate(command, COMMAND_SCHEMA);
    if (errors.length) {
      throw new Error(`Invalid command object: ${JSON.stringify(errors)}`);
    }

    command.fromPlugin = true;
    commands.COMMAND_LIST.push(command);
  },
  getOptions: () => config.get('options'),
  getSwitches: () => switches.active,
  getConfig: () => config,
  runCommand,
};

const loadPlugin = (moduleName) => {
  try {
    require(`${NODE_MODULES_PATH}/${moduleName}`)(API);
  } catch (e) {
    throw new Error(`Failed to load plugin: ${moduleName} (${e.stack})`);
  }
};

const loadPlugins = () => {
  fs.readdirSync(NODE_MODULES_PATH)
    .filter(item => item.startsWith(PREFIX))
    .forEach(loadPlugin);
};

module.exports = {
  API,
  loadPlugins,
};

/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { expect } = require('chai');
const { NAME, mockApi } = require('../util');
const api = require('../../src/modules/api');
const cli = require('../../src/functions/cli');
const commands = require('../../src/modules/commands');

const GREET_COMMAND = {
  about: 'Greet someone by name.',
  firstArg: 'greet',
  operations: {
    greetSomeone: {
      execute: ([name]) => console.log(`Hello, ${name}!`),
      pattern: '$name',
    },
  },
};

describe('api', () => {
  it('should not throw when loading all nearby plugins', () => {
    const loadAllPlugins = () => api.loadPlugins();
    expect(loadAllPlugins).to.not.throw();
  });

  it('should not throw when adding a valid command', () => {
    const addCommand = () => api.API.registerCommand(GREET_COMMAND);
    expect(addCommand).to.not.throw();
  });

  it('should throw when adding an invalid command', () => {
    const invalidCommand = {
      about: 'Greet someone by name.',
      operations: {
        greetSomeone: {
          executes: ([name]) => console.log(`Hello, ${name}!`),
          pattern: '$name',
        },
      },
    };

    const addCommand = () => api.API.registerCommand(invalidCommand);
    expect(addCommand).to.throw();
  });

  it('should have correctly added a new command', () => {
    const found = commands.COMMAND_LIST.find(item => item.firstArg === GREET_COMMAND.firstArg);

    expect(found).to.be.an('object');
  });

  it('should provide config.options', () => {
    const options = api.API.getOptions();

    expect(options).to.be.an('object');
  });

  it('should provide config.switches', () => {
    const switches = api.API.getSwitches();

    expect(switches).to.be.an('object');
  });

  it('should allow a command to be run', async () => {
    mockApi()
      .get('/products?perPage=30')
      .reply(200, [{ name: NAME }]);

    await api.API.runCommand(['products', 'list']);
  });

  it('should provide config interface', () => {
    const config = api.API.getConfig();

    expect(config.get).to.be.a('function');
    expect(config.set).to.be.a('function');
  });

  it('should provide access to operators', () => {
    const config = api.API.getConfig();

    const operators = config.get('operators');
    expect(operators).to.be.an('object');
  });

  it('should provide access to selected operator name', () => {
    const config = api.API.getConfig();

    const using = config.get('using');
    expect(using).to.be.a('string');
  });
});

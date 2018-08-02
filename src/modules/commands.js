/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const logger = require('./logger');
const switches = require('./switches');

const COMMAND_LIST = [
  require('../commands/access'),
  require('../commands/accesses'),
  require('../commands/account'),
  require('../commands/action'),
  require('../commands/action-type'),
  require('../commands/app-user'),
  require('../commands/batch'),
  require('../commands/collection'),
  require('../commands/file'),
  require('../commands/operator'),
  require('../commands/option'),
  require('../commands/place'),
  require('../commands/product'),
  require('../commands/project'),
  require('../commands/rateLimit'),
  require('../commands/redirector'),
  require('../commands/region'),
  require('../commands/role'),
  require('../commands/thng'),
  require('../commands/url'),
];

const showSyntax = (command) => {
  const { firstArg, operations } = command;
  const specs = Object.keys(operations).map(item => `evrythng ${firstArg} ${operations[item].pattern}`);

  logger.error(`\nAvailable operations for '${firstArg}':\n${specs.join('\n')}`);
  process.exit();
};

const matchArg = (arg, spec) => {
  const map = {
    // Value must be an EVRYTHNG ID
    $id: () => arg.length === 24,
    // Value must be JSON
    $payload: () => {
      if (switches.using(switches.BUILD)) {
        return true;
      }

      try {
        return (typeof arg === 'object') && JSON.parse(arg);
      } catch (e) {
        return false;
      }
    },
  };

  // A labelled value, such as $type for actions
  if (spec.startsWith('$')) {
    return true;
  }

  // Must match a map value, or must be identical
  return map[spec] ? map[spec]() : arg === spec;
};

const matchArgs = (args, pattern) => pattern.split(' ').every((item, i) => matchArg(args[i], item));

const identify = args => COMMAND_LIST.reduce((result, item) => {
  if (result) {
    return result;
  }

  const { operations, firstArg } = item;

  // firstArg matches
  if (args[0] === firstArg) {
    const match = Object.keys(operations)
      .find(item2 => matchArgs(args.slice(1), operations[item2].pattern));

    // Some command pattern matches as well
    if (match) {
      return operations[match];
    }

    // Only a partial match
    showSyntax(item);
    return result;
  }

  return result;
}, false);

module.exports = {
  identify,
  COMMAND_LIST,
  showSyntax,
  matchArg,
  matchArgs,
};

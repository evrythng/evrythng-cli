/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const config = require('../modules/config');
const logger = require('../modules/logger');

const OPTION_LIST = [{
  key: 'logLevel',
  name: 'log-level',
  about: 'Set level of output to the console (one of \'info\', \'error\').',
  type: 'string',
  allowed: ['info', 'error'],
}, {
  key: 'errorDetail',
  name: 'error-detail',
  about: 'Show full detail of errors encountered.',
  type: 'boolean',
}, {
  key: 'noConfirm',
  name: 'no-confirm',
  about: 'Skip the \'confirm?\' step for deletions.',
  type: 'boolean',
}, {
  key: 'showHttp',
  name: 'show-http',
  about: 'Show full details of HTTP requests.',
  type: 'boolean',
}, {
  key: 'defaultPerPage',
  name: 'default-per-page',
  about: 'The default number of items per page, between 1 and 100.',
  type: 'integer',
  range: [1, 100],
}];

const listAllOptions = () => {
  const options = config.get('options');

  logger.info('\nCurrent option settings:');
  Object.keys(options).forEach((optionKey) => {
    const option = OPTION_LIST.find(({ key }) => key === optionKey);
    logger.info(`- ${option.name}: ${options[optionKey]}`);
  });
};

const booleanSetter = () => (options, key, newValue) => {
  const allowed = ['true', 'false'];
  if (!allowed.includes(newValue)) {
    throw new Error(`Value must be one of ${allowed.join(', ')}`);
  }

  options[key] = (newValue === 'true');
};

const integerSetter = range => (options, key, newValue) => {
  const [min, max] = range;

  let intValue = 0;
  try {
    intValue = parseInt(newValue, 10);
  } catch (e) {
    throw new Error('Value must be an integer');
  }

  if (intValue < min || intValue > max) {
    throw new Error(`Value must be between ${min} and ${max}`);
  }

  options[key] = intValue;
};

const stringSetter = allowed => (options, key, newValue) => {
  if (!allowed.includes(newValue)) {
    throw new Error(`Value must be one of ${allowed.join(', ')}`);
  }

  options[key] = newValue;
};

/**
 * Check an option exists, and update it if it does.
 *
 * @param {string[]} args - The remaining launch arguments, including new option value.
 */
const checkAndSetOptionValue = (args) => {
  const [name, newValue] = args;
  if (typeof name === 'undefined') {
    const names = OPTION_LIST.map(p => p.name).join(', ');
    throw new Error(`Specify a valid option name from: ${names}`);
  }

  const option = OPTION_LIST.find(item => item.name === name);
  if (!option) {
    throw new Error(`Unknown option name '${name}'`);
  }

  const options = config.get('options');
  const { key, type, range, allowed } = option;
  const typeMap = {
    boolean: booleanSetter(),
    integer: integerSetter(range),
    string: stringSetter(allowed),
  };

  typeMap[type](options, key, newValue);
  config.set('options', options);
  logger.info(`\nSet option '${name}' to '${newValue}'`);
};

module.exports = {
  about: 'Choose CLI options.',
  firstArg: 'options',
  operations: {
    listOptions: {
      execute: listAllOptions,
      pattern: 'list',
    },
    setOption: {
      execute: checkAndSetOptionValue,
      pattern: '$name $newValue',
    },
  },
  OPTION_LIST,
};

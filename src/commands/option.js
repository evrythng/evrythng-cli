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
  values: ['info', 'error'],
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
    const found = OPTION_LIST.find(listOption => listOption.key === optionKey);
    logger.info(`- ${found.name}: ${options[optionKey]}`);
  });
};

const checkAndSetOptionValue = ([name, state]) => {
  if (!name) {
    throw new Error('Please specify an option $name');
  }

  const found = OPTION_LIST.find(item => item.name === name);
  if (!found) {
    throw new Error(`Unknown option name '${name}'`);
  }

  const options = config.get('options');
  const { key, type, range, values } = found;

  const typeMap = {
    boolean: () => {
      const allowed = ['true', 'false'];
      if (!allowed.includes(state)) {
        throw new Error(`Value must be one of ${allowed.join(', ')}`);
      }

      options[key] = (state === 'true');
    },
    integer: () => {
      const [min, max] = range;

      let intValue;
      try {
        intValue = parseInt(state, 10);
      } catch (e) {
        throw new Error('Value must be an integer');
      }

      if (intValue < min || intValue > max) {
        throw new Error(`Value must be between ${min} and ${max}`);
      }

      options[key] = intValue;
    },
    string: () => {
      if (!values.includes(state)) {
        throw new Error(`Value must be one of ${values.join(', ')}`);
      }

      options[key] = state;
    },
  };

  typeMap[type]();
  config.set('options', options);
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
      pattern: '$name $state',
    },
  },
  OPTION_LIST,
};

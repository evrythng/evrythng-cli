/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const evrythng = require('evrythng-extended');
const { getValue } = require('../modules/prompt');
const config = require('../modules/config');
const logger = require('../modules/logger');
const switches = require('../modules/switches');

const REGIONS = config.get('regions');

const getAvailableOperators = () => Object.keys(config.get('operators'));

const checkOperatorExists = (name) => {
  const items = getAvailableOperators();
  if (!items.includes(name)) {
    throw new Error(`\nOperator '${name}' not found in ${config.PATH}.`);
  }
};

const resolveKey = (name) => {
  checkOperatorExists(name);

  return config.get('operators')[name].apiKey;
};

const useOperator = ([name]) => {
  checkOperatorExists(name);
  config.set('using', name);
};

const formatOperator = item => `'${item}' (Key: ${resolveKey(item).substring(0, 4)}...)`;

const list = () => {
  const operators = getAvailableOperators();
  if (!operators.length) {
    logger.error('No Operators available.');
    return { operators: [], using: '' };
  }

  const formatted = operators.map(formatOperator).join('\n- ');
  logger.info(`\nCurrent: '${config.get('using')}'\nAvailable:\n- ${formatted}\n`);
  return { operators, using: config.get('using') };
};

const showKey = ([name]) => {
  const key = resolveKey(name);

  logger.info(key);
  return key;
};

const addOperator = ([, name, region, apiKey]) => {
  if (!REGIONS[region]) {
    throw new Error(`$region must be one of ${Object.keys(REGIONS).join(', ')}`);
  }
  if (name.includes(' ')) {
    throw new Error('Short name must be a single word');
  }
  if (apiKey.length !== 80) {
    throw new Error('API key is an invalid length');
  }

  const operators = config.get('operators');
  operators[name] = { apiKey, region };
  config.set('operators', operators);

  // If this is the first one, automatically use it.
  if (Object.keys(operators).length === 1) {
    useOperator([name]);
  }

  return operators[name];
};

const removeOperator = ([name]) => {
  const operators = config.get('operators');
  delete operators[name];
  config.set('operators', operators);

  if (config.get('using') === name) {
    config.set('using', '');
  }
};

const applyRegion = () => {
  const name = config.get('using');
  if (!name) {
    return;
  }

  const { region } = config.get('operators')[name];
  evrythng.setup({ apiUrl: REGIONS[region] });
};

const checkFirstRun = async () => {
  const operators = config.get('operators');
  if (Object.keys(operators).length) {
    return;
  }

  logger.info('\nWelcome to the EVRYTHNG CLI!\n\nTo get started, please provide the following '
    + 'to set up your first account Operator:\n');

  const name = await getValue('Short Operator name (e.g: \'personal\')');
  const region = await getValue('Account region (\'us\' or \'eu\')');
  const apiKey = await getValue('Operator API Key (from \'Account Settings\' in the EVRYTHNG Dashboard\')');
  addOperator([null, name, region, apiKey]);

  logger.info('\nYou\'re all set! Commands follow a \'resource type\' \'verb\' format. '
    + 'Some examples to get you started:\n');
  logger.info('  evrythng thng list');
  logger.info('  evrythng thng UnQ8nqfQeD8aQpwRanrXaaPt read');
  logger.info('  evrythng product create \'{"name": "My New Product"}\'\n');
  logger.info('Type \'evrythng\' to see all available commands and options.\n');
  process.exit();
};

const getCurrent = () => config.get('operators')[config.get('using')];


// ------------------------------------ API ------------------------------------

const getKey = () => {
  const key = switches.using(switches.API_KEY);
  if (key) {
    return key.value;
  }

  const operator = config.get('using');
  if (!operator) {
    throw new Error('No Operator has been selected yet. Use \'operator add\' to add one.');
  }

  return resolveKey(operator);
};

module.exports = {
  about: 'View and choose an Operator API Key for global use.',
  firstArg: 'operators',
  operations: {
    add: {
      execute: addOperator,
      pattern: 'add $name $region $apiKey',
    },
    list: {
      execute: list,
      pattern: 'list',
    },
    read: {
      execute: showKey,
      pattern: '$name read',
    },
    use: {
      execute: useOperator,
      pattern: '$name use',
    },
    remove: {
      execute: removeOperator,
      pattern: '$name remove',
    },
  },
  getKey,
  applyRegion,
  checkFirstRun,
  resolveKey,
  getCurrent,
};

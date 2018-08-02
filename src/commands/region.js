/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const config = require('../modules/config');
const logger = require('../modules/logger');

const getAvailableRegions = () => Object.keys(config.get('regions'));

const checkRegionExists = (name) => {
  const items = getAvailableRegions();
  if (!items.includes(name)) {
    throw new Error(`\nRegion '${name}' not found in ${config.PATH}.`);
  }
};

const formatRegion = (name) => {
  const regions = config.get('regions');
  return `'${name}' (URL: ${regions[name]})`;
};

const list = () => {
  const regions = getAvailableRegions();
  if (!regions.length) {
    logger.error('No regions available.');
    return regions;
  }

  const formatted = regions.map(formatRegion).join('\n- ');
  logger.info(`\nAvailable:\n- ${formatted}\n`);
  return regions;
};

const addRegion = ([, name, apiUrl]) => {
  if (name.includes(' ')) {
    throw new Error('Name must be a single word');
  }

  const regions = config.get('regions');
  regions[name] = apiUrl;
  config.set('regions', regions);

  return regions;
};

const removeRegion = ([name]) => {
  checkRegionExists(name);

  // Do not remove while in use
  const operators = config.get('operators');
  const inUse = Object.keys(operators).find(item => operators[item].region === name);
  if (inUse) {
    throw new Error('Cannot delete a region while an Operator is using it.');
  }

  const regions = config.get('regions');
  delete regions[name];
  config.set('regions', regions);
};


// ------------------------------------ API ------------------------------------

module.exports = {
  about: 'Manage regions in the CLI configuration.',
  firstArg: 'regions',
  operations: {
    add: {
      execute: addRegion,
      pattern: 'add $name $apiUrl',
    },
    list: {
      execute: list,
      pattern: 'list',
    },
    remove: {
      execute: removeRegion,
      pattern: '$name remove',
    },
  },
};

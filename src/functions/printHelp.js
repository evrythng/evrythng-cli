/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { COMMAND_LIST } = require('../modules/commands');
const { OPTION_LIST } = require('../commands/option');
const { SWITCH_LIST } = require('../modules/switches');
const indent = require('./indent');
const logger = require('../modules/logger');
const { description, name, version } = require('../../package.json');

const EXAMPLES = [{
  command: 'operators list',
  about: 'See all Operators',
}, {
  command: 'operators add prod us AGiWrH5OteA4aHiM...',
  about: 'Add a new Operator',
}, {
  command: 'thngs list',
  about: 'Read a page of Thngs',
}, {
  command: 'thngs UpUxnWAXeMPNQraRaGmKQdHr read',
  about: 'Read a single Thng',
}, {
  command: 'products create \'{"name": "My New Product"}\'',
  about: 'Create a new product',
}, {
  command: 'thngs list --filter tags=testing --per-page 1',
  about: 'Find one tagged Thng',
}, {
  command: 'thngs create --build',
  about: 'Interactively create a Thng',
}, {
  command: 'products list --per-page 100 --to-csv ./products.csv',
  about: 'Save products to a CSV file',
}, {
  command: 'products create --from-csv ./products.csv --project UnghCKffVg8a9KwRwE5C9qBs',
  about: 'Create products from a CSV file',
}];

const printVersion = () => logger.info(`\n${name} v${version}\n${description}`);

const getPaddingLength = items => items.reduce((result, item) => {
  const newLength = item.length;
  return (newLength > result) ? newLength : result;
}, 0);

const formatList = (list, label, descriptor, sort = true) => {
  let labels = list.map(item => item[label]);
  if (sort) {
    labels = labels.sort();
  }

  const maxPadLength = getPaddingLength(labels);
  list.forEach((item) => {
    const padLength = maxPadLength - item[label].length;
    item[label] = `${item[label]} ${' '.repeat(padLength)}`;
  });

  list.forEach(item => logger.info(indent(`${item[label]} ${item[descriptor]}`, 4)));
};

module.exports = () => {
  printVersion();
  logger.info('\nBasic Usage:\n');
  logger.info(indent('$ evrythng <command> <params>... [<payload>] [<switches>...]', 4));

  logger.info('\nDocumentation:\n');
  logger.info(indent('https://developers.evrythng.com/docs/evrythng-cli', 4));

  logger.info('\nAvailable Commands:\n');
  logger.info(indent('Specify a command name below to see syntax for all its operations.\n', 4));
  formatList(COMMAND_LIST.filter(item => !item.fromPlugin), 'firstArg', 'about');

  const thirdPartyCommands = COMMAND_LIST.filter(item => item.fromPlugin);
  if (thirdPartyCommands.length) {
    logger.info('\nAvailable Plugin Commands:\n');
    formatList(thirdPartyCommands, 'firstArg', 'about');
  }

  logger.info('\nAvailable Switches:\n');
  const switchList = SWITCH_LIST.map((item) => {
    item.name = `${item.name}${item.valueLabel ? ` ${item.valueLabel}` : ''}`;
    return item;
  });
  formatList(switchList, 'name', 'about');

  logger.info('\nAvailable Options:\n');
  logger.info(indent('Use \'options list\' to see current option states.\n', 4));
  formatList(OPTION_LIST, 'name', 'about');

  logger.info('\nUsage Examples:\n');
  formatList(EXAMPLES, 'about', 'command', false);
  logger.info();
};

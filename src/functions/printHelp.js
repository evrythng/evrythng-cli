const { COMMAND_LIST } = require('../modules/commands');
const { SWITCH_LIST } = require('../modules/switches');
const { OPTION_LIST } = require('../commands/option');
const version = require('../commands/version');
const indent = require('./indent');

const EXAMPLES = [{
  command: 'operator list',
  about: 'See all Operators',
}, {
  command: 'operator add prod us AGiWrH5OteA4aHiM...',
  about: 'Add a new Operator',
}, {
  command: 'thng list',
  about: 'Read a page of Thngs',
}, {
  command: 'thng UpUxnWAXeMPNQraRaGmKQdHr read',
  about: 'Read a known Thng',
}, {
  command: 'product create \'{"name": "My New Product"}\'',
  about: 'Create a new product',
}, {
  command: 'thng list --filter tags=testing --perpage 1',
  about: 'Find one tagged Thng',
}];

const getPaddingLength = (items) => items.reduce((result, item) => {
  const newLength = item.length;
  return (newLength > result) ? newLength : result;
}, 0);

const formatList = (list, label, descriptor, sort = true) => {
  let labels = list.map(item => item[label]);
  if (sort) labels = labels.sort();

  const maxPadLength = getPaddingLength(labels);
  list.forEach((item) => {
    const padLength = maxPadLength - item[label].length;
    item[label] = `${item[label]} ${' '.repeat(padLength)}`;
  });

  list.forEach(item => console.log(indent(`${item[label]} ${item[descriptor]}`, 4)));
};

module.exports = () => {
  version.operations.default.execute();
  console.log();
  console.log('Basic Usage:\n');
  console.log(indent('$ evrythng <command> <params>... [<payload>] [<switches>...]', 4));

  console.log('\nAvailable Commands:\n');
  console.log(indent('Specify a command name below to see syntax for all its operations.\n', 2));
  formatList(COMMAND_LIST, 'firstArg', 'about');

  console.log('\nAvailable Switches:\n');
  const switchList = SWITCH_LIST.map((item) => {
    item.name = `${item.name}${item.hasValue ? ' <value>' : ''}`;
    return item;
  });
  formatList(switchList, 'name', 'about');

  console.log('\nAvailable Options:\n');
  console.log(indent('Use \'option list\' to see option states.\n', 2));
  formatList(OPTION_LIST, 'name', 'about');

  console.log('\nUsage Examples:\n');
  formatList(EXAMPLES, 'about', 'command', false);

  console.log();
};

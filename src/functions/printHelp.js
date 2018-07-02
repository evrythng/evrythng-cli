const { COMMAND_LIST } = require('../modules/commands');
const { SWITCH_LIST } = require('../modules/switches');
const { OPTION_LIST } = require('../commands/option');
const version = require('../commands/version');
const indent = require('./indent');

const EXAMPLES = [{
  command: '    operator list',
  about: 'See all Operators',  
}, {
  command: '   operator add prod us AGiWrH5OteA4aHiM...',
  about: 'Add a new Operator',
}, {
  command: ' thng list',
  about: 'Read a page of Thngs',
}, {
  command: '    thng UpUxnWAXeMPNQraRaGmKQdHr read',
  about: 'Read a known Thng',
}, {
  command: ' product create \'{"name": "My New Product"}\'',
  about: 'Create a new product',
}, {
  command: ' thng list --filter tags=testing --perpage 1',
  about: 'Find one tagged Thng',
}];

module.exports = () => {
  version.operations.default.execute();
  console.log();
  console.log('Basic Usage:\n');
  console.log(indent('$ evrythng <command> <params>... [<payload>] [<switches>...]', 4));

  console.log('\nAvailable Commands:\n');
  console.log(indent('Specify a command name below to see syntax for all its operations.\n', 2));
  COMMAND_LIST.map(item => `${item.startsWith} - ${item.about}`)
    .sort()
    .forEach(item => console.log(indent(item, 4)));

  console.log('\nAvailable Switches:\n');
  SWITCH_LIST.map(item => `${item.name}${item.hasValue ? ' <value>' : ''} - ${item.about}`)
    .sort()
    .forEach(item => console.log(indent(item, 4)));

  console.log('\nAvailable Options:\n');
  console.log(indent('Use \'option list\' to see option states.\n', 2));
  OPTION_LIST.map(item => `${item.name} - ${item.about}`)
    .sort()
    .forEach(item => console.log(indent(item, 4)));

  console.log('\nUsage Examples:\n');
  EXAMPLES.map(item => `${item.about}: ${item.command}`)
    .forEach(item => console.log(indent(item, 4)));

  console.log();
};

const { COMMAND_LIST } = require('../modules/commands');
const { SWITCH_LIST } = require('../modules/switches');
const version = require('../commands/version');
const indent = require('./indent');

module.exports = () => {
  version.operations.default.execute();
  console.log();
  console.log('Basic Usage:\n');
  console.log(indent('$ evrythng <command> <params>... [<switches>...]', 4));

  console.log('\n');
  console.log('Available Commands:\n');
  console.log(indent('Specify a command name below to see syntax for all its operations.\n', 4));
  COMMAND_LIST.map(item => `${item.startsWith} - ${item.about}`)
    .sort()
    .forEach(item => console.log(indent(item, 4)));

  console.log('\n');
  console.log('Available Switches:\n');
  SWITCH_LIST.map(item => `${item.name}${item.hasValue ? ' <value>' : ''} - ${item.about}`)
    .sort()
    .forEach(item => console.log(indent(item, 4)));
  console.log();
};

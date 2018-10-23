module.exports = {
  about: 'See the help text, including usage examples.',
  firstArg: 'help',
  operations: {
    printHelp: {
      execute: () => require('../functions/printHelp')(),
      pattern: '',
    },
  },
};

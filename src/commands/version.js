const logger = require('../modules/logger');
const pkg = require('../../package.json');

const execute = () => logger.info(`\n${pkg.name} v${pkg.version}\n${pkg.description}`);

module.exports = {
  about: 'Print version information.',
  firstArg: 'version',
  operations: {
    default: {
      execute,
      pattern: 'version',
    },
  },
};

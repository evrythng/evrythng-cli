const pkg = require('../../package.json');

const config = require('../modules/config');

const execute = () => {
  const { noOutput } = config.get('options');
  if (noOutput) return;

  console.log(`\n${pkg.name} v${pkg.version}\n${pkg.description}`);
};

module.exports = {
  about: 'Print version information.',
  startsWith: 'version',
  operations: {
    default: {
      execute,
      pattern: 'version',
    },
  },
};


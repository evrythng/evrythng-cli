const config = require('../modules/config');
const logger = require('../modules/logger');

const OPTION_LIST = [{
  key: 'logLevel',
  name: 'log-level',
  about: 'Set level of output to the console (one of \'info\', \'error\')',
  values: ['info', 'error'],
}, {
  key: 'errorDetail',
  name: 'error-detail',
  about: 'Show full detail of errors encountered.',
  values: ['true', 'false'],
}, {
  key: 'noConfirm',
  name: 'no-confirm',
  about: 'Skip the \'confirm?\' step for deletions.',
  values: ['true', 'false'],
}, {
  key: 'showHttp',
  name: 'show-http',
  about: 'Show full details of HTTP requests',
  values: ['true', 'false'],
}];

module.exports = {
  about: 'Choose CLI options.',
  firstArg: 'option',
  operations: {
    listOptions: {
      execute: () => {
        const options = config.get('options');
        
        logger.info('\nOptions:');
        Object.keys(options).forEach((item) => {
          const found = OPTION_LIST.find(item2 => item2.key === item);
          logger.info(`- ${found.name}: ${options[item]}`);
        });
      },
      pattern: 'option list',
    },
    setOption: {
      execute: ([name, state]) => {
        if (!name) {
          throw new Error('Please specify an option $name');
        }

        const found = OPTION_LIST.find(item => item.name === name);
        if (!found) {
          throw new Error(`Unknown option name '${name}'`);
        }

        if (!found.values.includes(state)) {
          throw new Error(`Invalid input value (should be one of ${found.values.join(', ')})`);
        }

        const options = config.get('options');
        options[found.key] = ['true', 'false'].includes(state) ? (state === 'true') : state;
        config.set('options', options);
      },
      pattern: 'option $name $state',
    },
  },
  OPTION_LIST,
};

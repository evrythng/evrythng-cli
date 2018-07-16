const config = require('../modules/config');

const OPTION_LIST = [{
  key: 'noOutput',
  name: 'no-output',
  about: 'Print no output to the console.',
}, {
  key: 'errorDetail',
  name: 'error-detail',
  about: 'Show full detail of errors encountered.',
}, {
  key: 'noConfirm',
  name: 'no-confirm',
  about: 'Skip the \'confirm?\' step for deletions.',
}, {
  key: 'showHttp',
  name: 'show-http',
  about: 'Show full details of HTTP requests',
}];

module.exports = {
  about: 'Choose CLI options.',
  firstArg: 'option',
  operations: {
    listOptions: {
      execute: () => {
        const options = config.get('options');
        if (options.noOutput) return;

        console.log('\nOptions:');
        Object.keys(options).forEach((item) => {
          const found = OPTION_LIST.find(item2 => item2.key === item);
          console.log(`- ${found.name}: ${options[item]}`);
        });
      },
      pattern: 'option list',
    },
    setOption: {
      execute: ([name, state]) => {
        if (!name) throw new Error('Please specify an option $name');

        const found = OPTION_LIST.find(item => item.name === name);
        if (!found) throw new Error(`Unknown option name '${name}'`);

        const options = config.get('options');
        options[found.key] = (state === 'true');
        config.set('options', options);
      },
      pattern: 'option $name $state',
    },
  },
  OPTION_LIST,
};

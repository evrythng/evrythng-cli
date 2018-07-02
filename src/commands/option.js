const config = require('../modules/config');

module.exports = {
  about: 'Choose CLI options.',
  startsWith: 'option',
  operations: {
    listOptions: {
      execute: () => {
        const options = config.get('options');
        if(options.noOutput) return;

        console.log(`\nOptions:\n`);
        Object.keys(options).forEach(item => console.log(`- ${item}: ${options[item]}`));
      },
      pattern: 'option list',
    },
    setErrorDetail: {
      execute: ([, state]) => {
        const options = config.get('options');
        options.errorDetail = (state === 'true');
        config.set('options', options);
      },
      pattern: 'option error-detail $state',
    },
    setNoConfirm: {
      execute: ([, state]) => {
        const options = config.get('options');
        options.noConfirm = (state === 'true');
        config.set('options', options);
      },
      pattern: 'option no-confirm $state',
    },
    setShowHttp: {
      execute: ([, state]) => {
        const options = config.get('options');
        options.showHttp = (state === 'true');
        config.set('options', options);
      },
      pattern: 'option show-http $state',
    },
    setNoOutput: {
      execute: ([, state]) => {
        const options = config.get('options');
        options.noOutput = (state === 'true');
        config.set('options', options);
      },
      pattern: 'option no-output $state',
    },
  },
};

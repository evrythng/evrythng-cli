const config = require('../modules/config');

module.exports = {
  about: 'Choose CLI options.',
  startsWith: 'option',
  operations: {
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

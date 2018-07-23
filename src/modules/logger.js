const config = require('./config');

const { logLevel } = config.get('options');

const MAP = {
  info: 1,
  error: 0,
};

const log = (msg = '', level) => {
  if (MAP[logLevel] < MAP[level]) {
    return;
  }

  console.log(msg);
};

module.exports = {
  info: msg => log(msg, 'info'),
  error: msg => log(msg, 'error'),
};

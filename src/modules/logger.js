const config = require('./config');

const { logLevel } = config.get('options');

const MAP = {
  info: 1,
  error: 0,
};

const log = (level, msg = '') => {
  if (MAP[logLevel] < MAP[level]) {
    return;
  }

  console.log(msg);
};

module.exports = {
  info: msg => log('info', msg),
  error: msg => log('error', msg),
};

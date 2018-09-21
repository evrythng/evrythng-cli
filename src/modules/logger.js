/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const config = require('./config');

const MAP = {
  info: 1,
  error: 0,
};

const log = (level, msg = '', update = false) => {
  const { logLevel } = config.get('options');
  if (MAP[logLevel] < MAP[level]) {
    return;
  }

  if (update) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(msg);
    return;
  }

  console.log(msg);
};

module.exports = {
  info: (msg, update) => log('info', msg, update),
  error: msg => log('error', msg),
};

/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const config = require('./config');

const MAP = {
  info: 1,
  error: 0,
};

const log = (level, msg = '') => {
  const { logLevel } = config.get('options');
  if (MAP[logLevel] < MAP[level]) {
    return;
  }

  console.log(msg);
};

module.exports = {
  info: msg => log('info', msg),
  error: msg => log('error', msg),
};

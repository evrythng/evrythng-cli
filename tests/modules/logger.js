/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { expect } = require('chai');
const cli = require('../../src/functions/cli');
const config = require('../../src/modules/config');
const logger = require('../../src/modules/logger');

describe('logger', () => {
  before(async () => {
    const options = config.get('options');
    options.logLevel = 'info';
    config.set('options', options);
  });

  after(async () => {
    const options = config.get('options');
    options.logLevel = 'error';
    config.set('options', options);
  });

  it('should not throw when logging at info level', async () => {
    const log = () => logger.info('test info log');

    expect(log).to.not.throw();
  });

  it('should not throw when update logging at info level', async () => {
    const log = () => logger.info('test info log', true);

    expect(log).to.not.throw();
  });

  it('should not throw when logging at error level', async () => {
    const log = () => logger.error('test error message');

    expect(log).to.not.throw();
  });
});

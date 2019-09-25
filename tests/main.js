/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { expect } = require('chai');
const { ctx } = require('./util');
const sinon = require('sinon');
const cli = require('../src/functions/cli');
const config = require('../src/modules/config');
const expand = require('../src/functions/expand');
const indent = require('../src/functions/indent');
const operator = require('../src/commands/operator');

describe('CLI', () => {
  before(async () => {
    const options = config.get('options');
    ctx.savedOpts = JSON.parse(JSON.stringify(options));

    options.errorDetail = true;
    options.noConfirm = true;
    options.showHttp = false;
    options.logLevel = 'error';
    config.set('options', options);

    operator.applyRegion();
  });

  after(async () => {
    config.set('options', ctx.savedOpts);
  });

  afterEach(() => {
    sinon.restore();
  });

  require('./commands/access');
  require('./commands/accesses');
  require('./commands/account');
  require('./commands/action');
  require('./commands/action-type');
  require('./commands/adi-order');
  require('./commands/app-user');
  require('./commands/batch');
  require('./commands/collection');
  require('./commands/file');
  require('./commands/operator');
  require('./commands/option');
  require('./commands/place');
  require('./commands/product');
  require('./commands/project');
  require('./commands/purchase-order');
  require('./commands/rateLimit');
  require('./commands/redirector');
  require('./commands/region');
  require('./commands/role');
  require('./commands/shipment-notice');
  require('./commands/thng');
  require('./commands/url');

  require('./modules/api');
  require('./modules/commands');
  require('./modules/config');
  require('./modules/csvFile');
  require('./modules/functions');
  require('./modules/http');
  require('./modules/jsonFile');
  require('./modules/logger');
  require('./modules/prompt');
  require('./modules/switches');
  require('./modules/util');
});

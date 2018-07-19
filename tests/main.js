const { expect } = require('chai');

const config = require('../src/modules/config');
const { ctx } = require('./modules/util');
const cli = require('../src/functions/cli');
const expand = require('../src/functions/expand');
const indent = require('../src/functions/indent');
const operator = require('../src/commands/operator');

describe('CLI', () => {
  before(async () => {
    ctx.savedOpts = JSON.parse(JSON.stringify(config.get('options')));

    await cli('option no-output true');
    await cli('option no-confirm true');
    await cli('option show-http false');

    operator.applyRegion();
  });

  after(async () => {
    config.set('options', ctx.savedOpts);
  });

  require('./commands/access');
  require('./commands/accesses');
  require('./commands/account');
  require('./commands/action');
  require('./commands/action-type');
  require('./commands/app-user');
  require('./commands/batch');
  require('./commands/collection');
  require('./commands/file');
  require('./commands/operator');
  require('./commands/option');
  require('./commands/place');
  require('./commands/product');
  require('./commands/project');
  require('./commands/rateLimit');
  require('./commands/redirector');
  require('./commands/role');
  require('./commands/thng');
  require('./commands/url');
  require('./commands/version');

  require('./functions');
  require('./switches');
  require('./commands');
  require('./prompt');
  require('./util');
});

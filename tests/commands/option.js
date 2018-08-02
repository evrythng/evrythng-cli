/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const cli = require('../../src/functions/cli');
const config = require('../../src/modules/config');

const { expect } = chai;

chai.should();
chai.use(chaiAsPromised);

// Set each option to the value it is now to not confuse the user
describe('options', () => {
  it('should not throw error for \'options list\'', async () => {
    const optionList = async () => await cli('options list');

    expect(optionList).to.not.throw();
  });

  it('should not throw error for \'options error-detail $state\'', async () => {
    const { errorDetail } = config.get('options');

    return cli(`options error-detail ${errorDetail}`).should.be.fulfilled;
  });

  it('should not throw error for \'options no-confirm $state\'', async () => {
    const { noConfirm } = config.get('options');

    return cli(`options no-confirm ${noConfirm}`).should.be.fulfilled;
  });

  it('should not throw error for \'options show-http $state\'', async () => {
    const { showHttp } = config.get('options');

    return cli(`options show-http ${showHttp}`).should.be.fulfilled;
  });

  it('should not throw error for \'options log-level $state\'', async () => {
    const { logLevel } = config.get('options');

    return cli(`options log-level ${logLevel}`).should.be.fulfilled;
  });
});

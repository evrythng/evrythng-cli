const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const cli = require('../../src/functions/cli');
const config = require('../../src/modules/config');

const { expect } = chai;

chai.should();
chai.use(chaiAsPromised);

// Set each option to the value it is now to not confuse the user
describe('option', () => {
  it('should not throw error for \'option list\'', async () => {
    const optionList = async () => await cli('option list');

    expect(optionList).to.not.throw();
  });

  it('should not throw error for \'option error-detail $state\'', async () => {
    const { errorDetail } = config.get('options');

    return cli(`option error-detail ${errorDetail}`).should.be.fulfilled;
  });

  it('should not throw error for \'option no-confirm $state\'', async () => {
    const { noConfirm } = config.get('options');

    return cli(`option no-confirm ${noConfirm}`).should.be.fulfilled;
  });

  it('should not throw error for \'option show-http $state\'', async () => {
    const { showHttp } = config.get('options');

    return cli(`option show-http ${showHttp}`).should.be.fulfilled;
  });

  it('should not throw error for \'option log-level $state\'', async () => {
    const { logLevel } = config.get('options');

    return cli(`option log-level ${logLevel}`).should.be.fulfilled;
  });
});

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const cli = require('../../src/functions/cli');

chai.should();
chai.use(chaiAsPromised);

describe('version', () => {
  it('should return 200 for \'version\'', async () => cli('version').should.be.fulfilled);
});

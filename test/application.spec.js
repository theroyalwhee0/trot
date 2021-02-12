/**
 * trot:test/application.spec.js
 */

/**
 * Imports.
 */
const { describe, expect, it } = require('./testing');
const { mockDyn } = require('./mocks/dynasty');
const { mockLog } = require('./mocks/log');
const { mockProcess } = require('./mocks/process');
const { mockCommandLine } = require('./mocks/commandline');
const { applicationFactory } = require('../src/application');

/**
 * Shared test symbols.
 */
const sym = { };

/**
 * Test.
 */
describe('@theroyalwhee0/trot', () => {
  describe('application', () => {
    describe('applicationFactory', () => {
      it('should be a function', () => {
        expect(applicationFactory).to.be.a('function');
        expect(applicationFactory.length).to.equal(1);
      });
      it('should build an application and default to show help', async () => {
        const log = mockLog({ sym });
        const commandLine = mockCommandLine();
        const process = mockProcess();
        const dyn = mockDyn({
          log, commandLine, process,
        });
        const results = await applicationFactory(dyn);
        expect(results).to.equal(undefined);
        expect(log[sym.log_allLevels].callCount).to.equal(1);
        expect(log.info.callCount).to.equal(1);
        expect(commandLine.yargs.showHelp.callCount).to.equal(1);
      });
    });
  });
});

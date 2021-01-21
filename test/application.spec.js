/**
 * trot:test/application.spec.js
 */

/**
 * Imports.
 */
const { expect } = require('chai');
const { spy } = require('sinon');
const { mockDyn } = require('./mocks/dynasty');
const { mockLog } = require('./mocks/log');
const { applicationFactory } = require('../src/application');

/**
 * Shared test symbols.
 */
const sym = { };

/**
 * Test.
 */
describe('application', () => {
  describe('applicationFactory', () => {
    it('should be a function', () => {
      expect(applicationFactory).to.be.a('function');
      expect(applicationFactory.length).to.equal(1);
    });
    it('should build an application', async () => {
      const log = mockLog({ sym });
      const commandLineActions = spy();
      const dyn = mockDyn({
        log, commandLineActions,
      });
      const results = await applicationFactory(dyn);
      expect(results).to.equal(undefined);
      expect(log.debug.callCount).to.equal(1);
      expect(log[sym.log_allLevels].callCount).to.equal(1);
      expect(commandLineActions.callCount).to.equal(1);
    });
  });
});

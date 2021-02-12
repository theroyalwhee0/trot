/**
 * trot:test/errors.spec.js
 */

/**
 * Imports.
 */
const { describe, expect, it } = require('./testing');
const { mockLog } = require('./mocks/log');
const { mockProcess } = require('./mocks/process');
const { errorHandler } = require('../src/errors');

/**
 * Shared test symbols.
 */
const sym = { };

/**
 * Test.
 */
describe('@theroyalwhee0/trot', () => {
  describe('error', () => {
    describe('errorHandler', () => {
      it('should be a function', () => {
        expect(errorHandler).to.be.a('function');
        expect(errorHandler.length).to.equal(0);
      });
      it('should setup error handling', () => {
        const log = mockLog({ sym });
        const process = mockProcess({ sym });
        errorHandler({ log, process });
        expect(log[sym.log_allLevels].callCount).to.equal(0);
        expect(log.trace.callCount).to.equal(0);
        expect(process.on.callCount).to.equal(2);
      });
      it('should throw if not given log', () => {
        expect(() => {
          errorHandler();
        }).to.throw(TypeError, '"log" is required.');
      });
    });
  });
});

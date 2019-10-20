/**
 * trot:test/errors.spec.js
 */

/**
 * Imports.
 */
const { expect } = require('chai');
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
            expect(log[sym.log_allLevels].callCount).to.equal(1);
            expect(log.trace.callCount).to.equal(1);
            expect(process.on.callCount).to.equal(2);
        });
        it('should throw if not given log', () => {
            function failure() {
                errorHandler();
            }
            expect(failure).to.throw(TypeError, '"log" is required.');
        });
        it('should log unhandled exceptions', () => {
          const log = mockLog({ sym });
          const process = mockProcess({ sym });
          errorHandler({ log, process });
        });
        it('should log unhandled rejections', () => {

        });
        it('should handle exceptions with parents', () => {

        });
    });
});

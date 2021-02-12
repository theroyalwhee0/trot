/**
 * trot:test/logs.spec.js
 */

/**
 * Imports.
 */
const { describe, expect, it } = require('./testing');
const { logFactory } = require('../src/logs');
const { mockProcess } = require('./mocks/process');
const { mockBunyan } = require('./mocks/log');

/**
 * Shared test symbols.
 */
const sym = { };

/**
 * Log Factory test.
 * This is NOT a test of the underlying logger.
 */
describe('@theroyalwhee0/trot', () => {
  describe('logging', () => {
    describe('logFactory', () => {
      it('should be a function', () => {
        expect(logFactory).to.be.a('function');
        expect(logFactory.length).to.equal(0);
      });
      it('should build a logger', () => {
        const bunyan = mockBunyan({ sym });
        const process = mockProcess({ sym });
        const logger = logFactory({ process, bunyan });
        // Bunyan.
        expect(bunyan.resolveLevel.callCount).to.equal(1);
        expect(bunyan.createLogger.callCount).to.equal(1);
        // Process.
        expect(process[sym.process_env_getter].called).to.equal(true);
        // Logger instance.
        expect(logger).to.be.a('function');
        expect(logger.info).to.be.a('function');
        expect(logger.warn).to.be.a('function');
        expect(logger.error).to.be.a('function');
        expect(logger.level).to.be.a('function');
        expect(logger.level()).to.equal(50); // Error (50).
      });
      describe('should set logLevel', () =>  {
        it('manually', () => {
          const bunyan = mockBunyan({ sym });
          const process = mockProcess({ sym });
          const logger = logFactory({
            process, bunyan,
            level: 'DEBUG',
          });
          // Logger instance.
          expect(logger).to.be.a('function');
          expect(logger.level()).to.equal(20); // DEBUG (20).
        });
        it('from environment', () =>  {
          const bunyan = mockBunyan({ sym });
          const process = mockProcess({
            sym, env: {
              TROT_LOGLEVEL: 'TRACE',
            },
          });
          const logger = logFactory({ process, bunyan });
          // Logger instance.
          expect(logger).to.be.a('function');
          expect(logger.level()).to.equal(10); // TRACE (10).
        });
      });
    });
  });
});

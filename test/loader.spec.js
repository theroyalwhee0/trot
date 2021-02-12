/**
 * trot:test/loader.spec.js
 */

/**
 * Imports.
 */
const { describe, expect, it } = require('./testing');
const { loadScriptletsFactory } = require('../src/loader');

/**
 * Tests.
 */
describe('@theroyalwhee0/trot', () => {
  describe('loader', () => {
    describe('loadScriptletsFactory', () => {
      it('should be a function', () => {
        expect(loadScriptletsFactory).to.be.a('function');
        expect(loadScriptletsFactory.length).to.equal(1);
      });
    });
  });
});

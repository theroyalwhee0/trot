/**
 * trot:test/index.spec.js
 */

/**
 * Imports.
 */
const { describe, expect, it } = require('./testing');
const { trot } = require('../src/index');

/**
 * Test.
 */
describe('@theroyalwhee0/trot', () => {
  describe('trot', () => {
    it('should be a function', () => {
      expect(trot).to.be.a('function');
      expect(trot.length).to.equal(0);
    });
  });
});

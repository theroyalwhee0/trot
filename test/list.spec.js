/**
 * trot:test/list.spec.js
 */

/**
 * Imports.
 */
const { describe, expect, it } = require('./testing');
const { showListFactory } = require('../src/list');
const { mockDyn } = require('./mocks/dynasty');

/**
 * Test.
 */
describe('@theroyalwhee0/trot', () => {
  describe('list', () => {
    describe('showListFactory', () => {
      it('should be a function', () => {
        expect(showListFactory).to.be.a('function');
        expect(showListFactory.length).to.equal(1);
      });
      it('should create a listAll function', () => {
        const dyn = mockDyn();
        const showList = showListFactory(dyn);
        expect(showList).to.be.a('function');
      });
    });
  });
});

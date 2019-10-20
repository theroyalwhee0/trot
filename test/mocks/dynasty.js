/**
 * trot:test/mocks/dynasty.js
 */

/**
 * Imports.
 */
const { spy } = require('sinon');

/**
 * Mock dynasty 'dyn' function.
 */
function mockDyn(attached={}) {
  const dyn = spy((obj) => {
    if(obj && typeof obj === 'object') {
      Object.assign(obj, attached);
    }
    return attached;
  });
  dyn.isMock = true;
  return dyn;
}

/**
 * Exports.
 */
module.exports = {
  mockDyn,
};

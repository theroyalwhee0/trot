/**
 * trot:test/mocks/dynasty.js
 */

/**
 * Imports.
 */
const { spy } = require('sinon');

/**
 * Mock yargs instance.
 */
function mockYargs() {
  return {
    argv: { _: [] },
    showHelp: spy(),
  };
}

/**
 * Mock command line results.
 */
function mockCommandLine() {
  return {
    runArgv: [],
    yargs: mockYargs(),
  };
}

/**
 * Exports.
 */
module.exports = {
  mockCommandLine,
  mockYargs,
};

/**
 * trot:src/utility/exitcodes.js
 */

/**
 * Exit Codes.
 */
const EXIT_UNKNOWN = 127;
const EXIT_UNHANDLED = 126;
const EXIT_ERROR = 125;
const EXIT_OK = 0;

/**
 * Exit code meanings.
 */
const exitMeanings = {
  [EXIT_UNKNOWN]: 'Unknown error',
  [EXIT_UNHANDLED]: 'Unhandled error',
  [EXIT_ERROR]: 'General error',
  [EXIT_OK]: 'OK',
};

/**
 * Exports.
 */
module.exports = {
  EXIT_UNKNOWN,
  EXIT_UNHANDLED,
  EXIT_ERROR,
  EXIT_OK,
  exitMeanings,
};

/**
 * trot:src/runtypes/base.js
 */

/**
 * RunType base.
 */
class RunType {
  constructor({ fullPath, contents }) {
    this.fullPath = fullPath;
    this.contents = contents;
    this.data = this.parse(this.contents);
  }
}

/**
 * Exports.
 */
module.exports = {
  RunType,
};

/**
 * trot:src/runtypes/trotfile/toml.js
 */

/**
 * Imports.
 */
const toml = require('toml');
const { Trotfile } = require('./base');

/**
 * Trotfile.toml factory.
 */
function trotfiletomlFactory(dyn) {
  const { shellTypes } = dyn();
  class TrotfileToml extends Trotfile {
    constructor(...args) {
      super(...args);
      this.shellTypes = shellTypes;
    }
    static get filename() {
      return 'Trotfile.toml';
    }
    get filename() {
      return TrotfileToml.filename;
    }
    parse(contents) {
      return toml.parse(contents);
    }
  }
  return TrotfileToml;
}

/**
 * Exports.
 */
module.exports = {
  trotfiletomlFactory,
};

/**
 * trot:src/runtypes/trotfile/json.js
 */

/**
 * Imports.
 */
const { Trotfile } = require('./base');

/**
 * Trotfile.json factory.
 */
function trotfilejsonFactory(dyn) {
  const { shellTypes } = dyn();
  class TrotfileJson extends Trotfile {
    constructor(...args) {
      super(...args);
      this.shellTypes = shellTypes;
    }
    static get filename() {
      return 'Trotfile.json';
    }
    get filename() {
      return TrotfileJson.filename;
    }
    parse(contents) {
      return JSON.parse(contents);
    }
  }
  return TrotfileJson;
}

/**
 * Exports.
 */
module.exports = {
  trotfilejsonFactory,
};

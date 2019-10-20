/**
 * trot:src/shelltypes/python3.js
 */

/**
 * Imports.
 */
const { ShellType } = require('./base');

/**
 * Python 3 shell.
 */
class Python3Shell extends ShellType {
  get name() {
    return 'python3';
  }

  get template() {
    return [ 'python3', '-q', { script: true }, '--', { args: true }];
  }

  get header() {
    return '#!/usr/bin/python3\n';
  }

  comment(text) {
    return `# ${text}\n`;
  }
}

/**
 * Exports.
 */
module.exports = {
  Python3Shell,
};

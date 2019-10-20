/**
 * trot:src/shelltypes/python2.js
 */

/**
 * Imports.
 */
const { ShellType } = require('./base');

/**
 * Python 2 shell.
 */
class Python2Shell extends ShellType {
  get name() {
    return 'python2';
  }

  get template() {
    return [ 'python2', { script: true }, '--', { args: true }];
  }

  get header() {
    return '#!/usr/bin/python2\n';
  }

  comment(text) {
    return `# ${text}\n`;
  }
}

/**
 * Exports.
 */
module.exports = {
  Python2Shell,
};

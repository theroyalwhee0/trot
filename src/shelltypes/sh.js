/**
 * trot:src/shelltypes/sh.js
 */

/**
 * Imports.
 */
const { ShellType } = require('./base');

/**
 * Sh shell.
 */
class ShShell extends ShellType {
  get name() {
    return 'sh';
  }

  get template() {
    return [ 'sh', '--', { script: true }, { args: true }];
  }

  get header() {
    return '#!/usr/bin/env sh\n';
  }

  comment(text) {
    return `# ${text}\n`;
  }
}

/**
 * Exports.
 */
module.exports = {
  ShShell,
};

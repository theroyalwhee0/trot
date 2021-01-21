/**
 * trot:src/shelltypes/bash.js
 */

/**
 * Imports.
 */
const { ShellType } = require('./base');

/**
 * Bash shell.
 */
class BashShell extends ShellType {
  get name() {
    return 'bash';
  }

  get template() {
    return [ 'bash',  '--',  { script: true }, { args: true }];
  }

  get header() {
    return '#!/usr/bin/env bash\n';
  }

  comment(text) {
    return `# ${text}\n`;
  }
}

/**
 * Exports.
 */
module.exports = {
  BashShell,
};

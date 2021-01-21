/**
 * trot:src/shelltypes/dash.js
 */

/**
 * Imports.
 */
const { ShellType } = require('./base');

/**
 * Dash shell.
 */
class DashShell extends ShellType {
  get name() {
    return 'dash';
  }

  get template() {
    return [ 'dash', '--', { script: true }, { args: true }];
  }

  get header() {
    return '#!/usr/bin/env dash\n';
  }

  comment(text) {
    return `# ${text}\n`;
  }
}

/**
 * Exports.
 */
module.exports = {
  DashShell,
};

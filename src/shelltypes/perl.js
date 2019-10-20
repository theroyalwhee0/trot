/**
 * trot:src/shelltypes/perl.js
 */

/**
 * Imports.
 */
const { ShellType } = require('./base');

/**
 * Perl shell.
 */
class PerlShell extends ShellType {
  get name() {
    return 'perl';
  }

  get template() {
    return [ 'perl', '--', { script: true }, { args: true }];
  }

  comment(text) {
    return `# ${text}\n`;
  }
}

/**
 * Exports.
 */
module.exports = {
  PerlShell,
};
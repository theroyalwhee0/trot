/**
 * trot:src/shelltypes/node.js
 */

/**
 * Imports.
 */
const { ShellType } = require('./base');

/**
 * Node shell.
 */
class NodeShell extends ShellType {
  get name() {
    return 'node';
  }

  get template() {
    return [ 'node', { script: true }, '--', { args: true }];
  }

  comment(text) {
    return `// ${text}\n`;
  }
}

/**
 * Exports.
 */
module.exports = {
  NodeShell,
};

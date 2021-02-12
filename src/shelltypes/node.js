/**
 * trot:src/shelltypes/node.js
 */

/**
 * Node Shell factory.
 */
function nodeShellFactory() {
  return {
    name: 'node',
    get template() {
      return [ 'node', { script: true }, '--', { args: true }];
    },
    get header() {
      return '#!/usr/bin/env node\n';
    },
    comment(text) {
      return `// ${text}\n`;
    },
    body(text) {
      return text + '\n';
    },
  };
}

/**
 * Exports.
 */
module.exports = {
  nodeShellFactory,
};

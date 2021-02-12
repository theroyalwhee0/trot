/**
 * trot:src/shelltypes/bash.js
 */

/**
 * Bash Shell factory.
 */
function bashShellFactory() {
  return {
    name: 'bash',
    get template() {
      return [ 'bash',  '--',  { script: true }, { args: true }];
    },
    get header() {
      return '#!/usr/bin/env bash\n';
    },
    comment(text) {
      return `# ${text}\n`;
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
  bashShellFactory,
};

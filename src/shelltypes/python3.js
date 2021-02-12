/**
 * trot:src/shelltypes/python3.js
 */

/**
 * Python3 Shell factory.
 */
function python3ShellFactory() {
  return {
    name: 'python3',
    get template() {
      return [ 'python3', '-q', { script: true }, '--', { args: true }];
    },
    get header() {
      return '#!/usr/bin/env python3\n';
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
  python3ShellFactory,
};

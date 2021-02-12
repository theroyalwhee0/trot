/**
 * trot:src/shelltypes/python2.js
 */

/**
 * Python2 Shell factory.
 */
function python2ShellFactory() {
  return {
    name: 'python2',
    get template() {
      return [ 'python2', { script: true }, '--', { args: true }];
    },
    get header() {
      return '#!/usr/bin/env python2\n';
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
  python2ShellFactory,
};

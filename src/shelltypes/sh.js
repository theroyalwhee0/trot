/**
 * trot:src/shelltypes/sh.js
 */

/**
 * sh Shell factory.
 */
function shShellFactory() {
  return {
    name: 'sh',
    get template() {
      return [ 'sh', '--', { script: true }, { args: true }];
    },
    get header() {
      return '#!/usr/bin/env sh\n';
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
  shShellFactory,
};

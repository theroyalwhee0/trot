/**
 * trot:src/shelltypes/perl.js
 */

/**
 * Perl Shell factory.
 */
function perlShellFactory() {
  return {
    name: 'perl',
    get template() {
      return [ 'perl', '--', { script: true }, { args: true }];
    },
    get header() {
      return '#!/usr/bin/env perl\n';
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
  perlShellFactory,
};

/**
 * trot:src/index.js
 */

/**
 * General Imports.
 */
const { dynasty } = require('@theroyalwhee0/dynasty');

/**
 * Application Imports.
 */
const { applicationFactory } = require('./application');
const { commandLineFactory } = require('./cmdline');
const { logFactory } = require('./logs');
const { errorHandler } = require('./errors');
const { loadScriptletsFactory } = require('./loader');
const { showListFactory } = require('./list');
const { runActionsFactory } = require('./actions');
const pkg = require('../package.json');

/**
 * Scriptlet Type Imports.
 */
const { packageJsonFactory } = require('./scriptlets/packagejson');
const { trotfileFactory } = require('./scriptlets/trotfile');

/**
 * Shell Type Imports.
 */
const { bashShellFactory } = require('./shelltypes/bash');
const { nodeShellFactory } = require('./shelltypes/node');
const { perlShellFactory } = require('./shelltypes/perl');
const { python2ShellFactory } = require('./shelltypes/python2');
const { python3ShellFactory } = require('./shelltypes/python3');
const { shShellFactory } = require('./shelltypes/sh');

/**
 * The Trot application.
 */
async function trot() {
  const { log, err } = (function setup() {
    try {
      const log = logFactory(pkg);
      errorHandler({ log });
      return { log };
    } catch(err) {
      return { err };
    }
  }());
  if(err) {
    console.error('An error occured setting up logging or error handling:', err);
    process.exit(1);
  }
  await dynasty(async ({ add, once, entryPoint, value, attach, depends, collect, extend }) => {
    // General.
    add('main', entryPoint(), depends('app'));
    add('log', value(log));
    add('commandLine', once(commandLineFactory), attach('log'));
    add('app',
      once(applicationFactory),
      attach('log', 'commandLine', 'showList', 'runActions')
    );
    // Commands.
    add('runActions',
      once(runActionsFactory),
      attach('log', 'loadScriptlets')
    );
    add('showList',
      once(showListFactory),
      attach('log', 'loadScriptlets')
    );
    // Scriptlets.
    add('loadScriptlets',
      once(loadScriptletsFactory),
      attach('log', 'scriptletTypes')
    );
    // Script Types.
    add('scriptletTypes',
      collect(),
      attach(
        'trotfile',
        'packageJson'
      )
    );
    add('trotfile',
      once(trotfileFactory),
      attach('log', 'shellTypes')
    );
    add('packageJson',
      once(packageJsonFactory),
      attach('log')
    );
    // Shell Types.
    add('shellTypes',
      collect(),
      attach('bash', 'node', 'perl', 'python2', 'python3', 'sh')
    );
    add('bash',
      once(bashShellFactory)
    );
    add('node',
      once(nodeShellFactory)
    );
    add('perl',
      once(perlShellFactory)
    );
    add('python2',
      once(python2ShellFactory)
    );
    add('python3',
      once(python3ShellFactory)
    );
    add('sh',
      once(shShellFactory)
    );
  });
}

/**
 * Exports.
 */
module.exports = {
  trot,
};

/**
 * trot:src/index.js
 */

/**
 * Imports.
 */
const { dynasty } = require('@theroyalwhee0/dynasty');

/**
 * Application.
 */
const { logFactory } = require('./logs');
const { errorHandler } = require('./errors');
const { applicationFactory } = require('./application');
const pkg = require('../package.json');

/**
 * Configuration.
 */
const { commandLineFactory, commandLineActionsFactory } = require('./commandline');
// const { configureEnvironmentFactory } = require('./envconfig');

/**
 * RunScripts.
 */
const { runScriptsLoaderFactory } = require('./runscript/loader');

/**
 * RunScript Types.
 */
const { trotfiletomlFactory } = require('./runtypes/trotfile/toml');
const { trotfilejsonFactory } = require('./runtypes/trotfile/json');
const { packagejsonFactory } = require('./runtypes/packagejson');

/**
 * Shell Types.
 */
const { shellTypeFactory } = require('./shelltypes');
const { ShShell } = require('./shelltypes/sh');
const { BashShell } = require('./shelltypes/bash');
const { DashShell } = require('./shelltypes/dash');
const { Python3Shell } = require('./shelltypes/python3');
const { Python2Shell } = require('./shelltypes/python2');
const { NodeShell } = require('./shelltypes/node');
const { PerlShell } = require('./shelltypes/perl');

/**
 * Tasks.
 */
const { listAllFactory } = require('./tasks/list');
const { runAllFactory } = require('./tasks/run');

/**
 * Wire up application.
 */
async function trot() {
  const { log, err } = (function setup() {
    try {
      const log = logFactory({ pkg });
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
  await dynasty(async ({ add, once, entryPoint, value, attach, depends, extend }) => {
    // General.
    add('main', entryPoint(), depends('app'));
    add('app',
      once(applicationFactory),
      attach('log', 'commandLineActions')
    );
    add('log', value(log));
    // Command Line.
    add('commandLine',
      once(commandLineFactory),
      attach('log')
    );
    add('commandLineActions',
      once(commandLineActionsFactory),
      attach(
        'log',
        'commandLine',
        'listAll',
        'runAll'
        // 'configureEnvironment'
      )
    );
    // Configuration.
    // add('configureEnvironment',
    //   once(configureEnvironmentFactory),
    //   attach('log')
    // );
    // Runscripts.
    add('runScriptLoader',
      once(runScriptsLoaderFactory),
      attach(
        'log',
        'trotfileToml',
        'trotfileJson',
        'packageJson'
      )
    );
    // Runscript Types.
    add('trotfileToml',
      once(trotfiletomlFactory),
      attach('log', 'shellTypes')
    );
    add('trotfileJson',
      once(trotfilejsonFactory),
      attach('log', 'shellTypes')
    );
    add('packageJson',
      once(packagejsonFactory),
      attach('log')
    );

    // Shell Types.
    add('shellTypes',
      once(shellTypeFactory),
      attach(
        'log',
        'shShell',
        'bashShell',
        'dashShell',
        'python2Shell',
        'python3Shell',
        'nodeShell',
        'perlShell'
      )
    );
    add('python3Shell',
      value(Python3Shell)
    );
    add('python2Shell',
      value(Python2Shell)
    );
    add('perlShell',
      value(PerlShell)
    );
    add('bashShell',
      value(BashShell)
    );
    add('dashShell',
      value(DashShell)
    );
    add('nodeShell',
      value(NodeShell)
    );
    add('shShell',
      value(ShShell)
    );

    // Tasks.
    add('listAll',
      once(listAllFactory),
      attach('runScriptLoader')
    );
    add('runAll',
      once(runAllFactory),
      attach('log', 'runScriptLoader', 'commandLine')
    );
  });
};

/**
 * Exports.
 */
module.exports = {
  trot,
};

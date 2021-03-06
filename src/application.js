/**
 * trot:src/application.js
 */

/**
 * Imports.
 */
const chalkLib = require('chalk');
const { AppError } = require('./utility/exceptions');
const { EXIT_OK, EXIT_ERROR } = require('./utility/exitcodes');
const processLib = process;

/**
 * Application factory.
 */
async function applicationFactory(dyn) {
  const { log, commandLine, showList, runActions, chalk=chalkLib, process=processLib } = dyn();
  // Colors.
  const red = chalk.red;
  // const green = chalk.bold.green;
  const writeln = console.log;
  const { yargs, runArgv } = commandLine;
  const { argv } = yargs;
  log.info('Application started.');
  const recursive = !!argv.recursive;
  const cwd = process.cwd();
  let exitCode = EXIT_OK;
  try {
    if(argv.list) {
      // If show list...
      await showList({ recursive, cwd });
    } else if(argv._.length === 1) {
      // If given an action to run...
      const dump = !!argv.dump;
      const actions = argv._[0];
      const args = runArgv;
      exitCode = await runActions({ actions, recursive, dump, cwd, args });
    } else {
      // Else show help...
      yargs.showHelp();
    }
  } catch(err) {
    if(err instanceof AppError) {
      writeln(red(err.message));
      exitCode = EXIT_ERROR;
    } else {
      throw err;
    }
  }
  // NOTE: --version & --help are handled by Yargs.
  process.on('exit', () => {
    log.info(`Exiting (${exitCode})`);
  });
  process.exit(exitCode);
}

/**
 * Exports.
 */
module.exports = {
  applicationFactory,
};

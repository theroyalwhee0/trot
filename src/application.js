/**
 * trot:src/application.js
 */

/**
 * Imports.
 */
const processLib = process;

/**
 * Application factory.
 */
async function applicationFactory(dyn) {
  const { log, commandLine, showList, runActions, process=processLib } = dyn();
  const { yargs, runArgv } = commandLine;
  const { argv } = yargs;
  log.info('Application started.');
  const recursive = !!argv.recursive;
  const cwd = process.cwd();
  let exitCode = 0;
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

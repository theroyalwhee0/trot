/**
 * trot:src/commandline.js
 */

/**
 * Imports.
 */
const yargsLib = require('yargs');
const processLib = process;

/**
 * CommandLine factory.
 */
function commandLineFactory(dyn) {
  const { process=processLib, yargs=yargsLib } = dyn();
  // NOTE: Discard first two indexes, node & trot bin files.
  const { argv, runArgv } = process.argv.slice(2).reduce(({ argv, runArgv }, value) => {
    if(runArgv) {
      // Collect everything after the first non-flag value.
      runArgv.push(value);
    } else {
      // Collect argv flags up to first non-flag value.
      if(/^(-\w|--\w+)$/.test(value)) {
        argv.push(value);
      } else {
        // Include the first non-flag value.
        argv.push(value);
        runArgv = [ ];
      }
    }
    return { argv, runArgv };
  }, { argv: [] });
  const built = yargs(argv)
    .option('dump', {
      describe: 'dump the run scripts to the screen without running them',
      type: 'boolean',
    })
    .option('list', {
      describe: 'list available run scripts',
      type: 'boolean',
      alias: 'l',
    });
  return {
    yargs: built,
    argv,  runArgv,
  };
}

/**
 * CommandLine Actions factory.
 */
function commandLineActionsFactory(dyn) {
  const { commandLine, listAll, runAll } = dyn();
  const argv = commandLine.yargs.argv;
  return async function commandLineActions() {
    if(argv.list) {
      await listAll();
    } else if(argv._.length === 1) {
      const context = { };
      await runAll({ actionNames: argv._[0], dump: argv.dump, context });
    } else {
      commandLine.yargs.showHelp();
    }
    return true;
  };
}

/**
 * Exports.
 */
module.exports = {
  commandLineFactory,
  commandLineActionsFactory,
};

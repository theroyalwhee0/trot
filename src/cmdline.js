/**
 * trot:src/cmdline.js
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
  const { log, process=processLib, yargs=yargsLib } = dyn();
  log.trace(`Command Line "${process.argv.join(' ')}"`);
  // NOTE: Discard first two indexes, node & trot bin files.
  const { argv, runArgv } = process.argv.slice(2).reduce(({ argv, runArgv }, value) => {
    if(runArgv) {
      // Collect everything after the first non-flag value.
      runArgv.push(value);
    } else {
      // Collect argv flags up to first non-flag value.
      if(/^(--|-\w|--\w+)$/.test(value)) {
        if(value !== '--') {
          // Ignore '--'.
          argv.push(value);
        }
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
    .option('recursive', {
      describe: 'operate on folders recursivly',
      type: 'boolean',
      alias: 'R',
    })
    .option('list', {
      describe: 'list available run scripts',
      type: 'boolean',
      alias: 'l',
    });
  return {
    yargs: built,
    argv, runArgv,
  };
}

/**
 * Exports.
 */
module.exports = {
  commandLineFactory,
};

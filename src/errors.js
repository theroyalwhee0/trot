/**
 * trot:src/errors.js
 */

/**
 * Constants.
 */
const processLib = process;

/**
 * Exit Codes.
 */
const MAXCAUSEDEPTH = 8;
const EXIT_UNKNOWN = 127;
const EXIT_UNHANDLED = 126;
const exitMeanings = {
  [EXIT_UNKNOWN]: 'Unknown error.',
  [EXIT_UNHANDLED]: 'Unhandled error.',
};

/**
 * Error Handler.
 * @param  {Object} options Options for error handler..
 */
function errorHandler({ log, process=processLib }={}) {
  if(!log) {
    throw new TypeError('"log" is required.');
  }
  function errorExit(exitCode=EXIT_UNKNOWN) {
    const meaning = exitMeanings[exitCode] || 'Not given.';
    log.warn({ meaning, exitCode }, 'Exiting because of failure.');
    process.exit(exitCode);
  }
  process.on('unhandledRejection', (err) => {
    try {
      log.error(err, 'Unhandled rejection.');
      let cause = err.parent;
      const previousCauses = [ err, cause ];
      while(cause instanceof Error) {
        log.error(cause, 'Cause of unhandled rejection.');
        cause = cause.parent;
        if(previousCauses.includes(cause)) {
          log.error('Circular reference found in rejection causes. Aborting.');
          break;
        } else if(previousCauses.length >= MAXCAUSEDEPTH) {
          log.error(`Maximum cause depth ${MAXCAUSEDEPTH} reached. Aborting.`);
          break;
        }
        previousCauses.push(cause);
      }
    } catch(ex) {
      console.error('An error occured logging an unhandled rejection', err, ex);
    }
    errorExit(EXIT_UNHANDLED);
  });
  process.on('uncaughtException', (err) => {
    try {
      log.error(err, 'Unhandled exception.');
      let cause = err.parent;
      const previousCauses = [ err, cause ];
      while(cause instanceof Error) {
        log.error(cause, 'Cause of unhandled exception.');
        cause = cause.parent;
        if(previousCauses.includes(cause)) {
          log.error('Circular reference found in exception causes. Aborting.');
          break;
        } else if(previousCauses.length >= MAXCAUSEDEPTH) {
          log.error(`Maximum cause depth ${MAXCAUSEDEPTH} reached. Aborting.`);
          break;
        }
        previousCauses.push(cause);
      }
    } catch(ex) {
      console.error('An error occured logging an unhandled exception', err, ex);
    }
    errorExit(EXIT_UNHANDLED);
  });
}

/**
 * Exports.
 */
module.exports = {
  errorHandler,
};

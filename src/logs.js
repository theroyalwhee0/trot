/**
 * trot:src/logs.js
 */

/**
 * Imports.
 */
const path = require('path');
const bunyanLib = require('bunyan');
const bunyanDebugStream = require('bunyan-debug-stream');
const processLib = process;

/**
 * Constants.
 */
const LOGLEVEL='TROT_LOGLEVEL';

/**
 * Log Factory.
 * @param  {Object} options Options for logger.
 * @return {BunyanLogger} A bunyan logger.
 */
function logFactory({
  name, level, pkg, pretty=true, basepath,
  streamOptions, bunyan=bunyanLib, process=processLib
}={}) {
  level = level === undefined ? process.env[LOGLEVEL] || 'info' : level;
  level = bunyan.resolveLevel(level);
  if(!name) {
    if(pkg) {
      if(pkg.config && pkg.config.shortName) {
        name = ''+pkg.config.shortName;
      } else {
        name = ''+pkg.name;
      }
    } else {
      name = 'unnamed';
    }
  }
  const settings = {
    name,
  };
  settings.level = level;
  if(pretty) {
    const debugStreamOptions = Object.assign({
        basepath,
        forceColor: true,
      }, streamOptions);
    const debugStream = {
      level,
      type: 'raw',
      stream: bunyanDebugStream(debugStreamOptions),
    };
    Object.assign(settings, {
      streams: [ debugStream ],
      serializers: bunyanDebugStream.serializers,
    });
  }
  return bunyan.createLogger(settings);
}

/**
 * Exports.
 */
module.exports = {
  logFactory,
};

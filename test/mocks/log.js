/**
 * trot:test/mocks/log.js
 */

/**
 * Imports.
 */
const { spy } = require('sinon');
const bunyan = require('bunyan');

/**
 * Take the first defined value from args.
 */
function takeFirstDefined(...args) {
  for(let value of args) {
    if(value !== undefined) {
      return value;
    }
  }
  return undefined;
}

/**
 * Mock logger.
 */
function mockLog({ level, logLevel, sym={} }={}) {
  logLevel = takeFirstDefined(logLevel, level, 30);
  const log_allLevels = sym.log_allLevels = sym.log_allLevels || Symbol('log_allLevels');
  const log = spy();
  const baseLogger = spy();
  Object.assign(log, {
    [log_allLevels]: baseLogger,
    info: spy(baseLogger),
    error: spy(baseLogger),
    warn: spy(baseLogger),
    debug: spy(baseLogger),
    trace: spy(baseLogger),
    level: spy(() => logLevel),
  });
  log.isMock = true;
  return log;
}

/**
 * Mock bunyan.
 */
function mockBunyan({ sym={} }={}) {
  const resolveLevel = spy(bunyan.resolveLevel);
  const createLogger = spy(function createLogger({ level }={}) {
    return mockLog({ level, sym });
  });
  resolveLevel.isMock = true;
  createLogger.isMock = true;
  return {
    resolveLevel, createLogger,
  };
}

/**
 * Exports.
 */
module.exports = {
  mockLog, mockBunyan,
};

/**
 * trot:test/mocks/process.js
 */

/**
 * Imports.
 */
const { spy } = require('sinon');
const EventEmitter = require('events');

/**
 * Mock process.
 */
function mockProcess({ env, argv, sym={} }={}) {
  const process_env = sym.process_env = sym.process_env || Symbol('process_env');
  const process_env_getter = sym.process_env_getter = sym.process_env_getter || Symbol('process_env_getter');
  const process_argv = sym.process_argv = sym.process_argv || Symbol('process_argv');
  const process_argv_getter = sym.process_argv_getter = sym.process_argv_getter || Symbol('process_argv_getter');
  class MockProcess extends EventEmitter { }
  MockProcess.prototype.isMock = true;
  for(let memberName of [ 'constructor', 'on', 'off', 'once' ]) {
    MockProcess.prototype[memberName] = spy(MockProcess.prototype[memberName]);
  }
  const env_getter = spy(function env_getter() {
    const results = this[process_env] = this[process_env] || Object.assign({ }, env);
    return results;
  });
  const argv_getter = spy(function env_getter() {
    const results = this[process_argv] = this[process_argv] || argv || [
      '/bin/node', '/tmp/testfile.js',
    ];
    return results;
  });
  Object.assign(MockProcess.prototype, {
    exit: spy(),
    cwd: spy(() => '/tmp'),
    [process_env_getter]: env_getter,
    [process_argv_getter]: argv_getter,
  });
  Object.defineProperty(MockProcess.prototype, 'env', { get: env_getter });
  Object.defineProperty(MockProcess.prototype, 'argv', { get: argv_getter });
  const process = new MockProcess();
  return process;
}

/**
 * Exports.
 */
module.exports = {
  mockProcess,
};

/**
 * trot:test/commandline.spec.js
 */

/**
 * Imports.
 */
const { describe, expect, it } = require('./testing');
const { commandLineFactory } = require('../src/cmdline');
const { mockDyn } = require('./mocks/dynasty');
const { mockProcess } = require('./mocks/process');
const { mockLog } = require('./mocks/log');

/**
 * Shared test symbols.
 */
const sym = { };

/**
 * Test.
 */
describe('@theroyalwhee0/trot', () => {
  describe('command line', () => {
    describe('commandLineFactory', () => {
      it('should be a function', () => {
        expect(commandLineFactory).to.be.a('function');
        expect(commandLineFactory.length).to.equal(1);
      });
      it('should process the command line', () => {
        const argv = [
          '/bin/node', '/tmp/testfile.js',
          '--list', 'build', '--dev',
        ];
        const process = mockProcess({ sym, argv });
        const log = mockLog();
        const dyn = mockDyn({ sym, process, log });
        const results = commandLineFactory(dyn);
        expect(results.argv).to.eql([
          '--list', 'build',
        ]);
        expect(results.runArgv).to.eql([
          '--dev',
        ]);
        expect(results.yargs).to.be.an('object');
        const { '$0':runName, ...remainder } = results.yargs.argv;
        expect(runName).to.be.a('string');
        expect(remainder).to.eql({
          _: ['build'],
          'l': true,
          'list': true,
        });
      });
    });
    it('should support --list', () => {
      const argv = [ '/bin/node', '/tmp/testfile.js', '--list' ];
      const process = mockProcess({ sym, argv });
      const log = mockLog();
      const dyn = mockDyn({ sym, process, log });
      const results = commandLineFactory(dyn);
      const yargs = results.yargs;
      expect(yargs.argv.list).to.be.true;
      expect(yargs.argv.l).to.be.true;
    });
    it('should support --dump', () => {
      const argv = [ '/bin/node', '/tmp/testfile.js', '--dump' ];
      const process = mockProcess({ sym, argv });
      const log = mockLog();
      const dyn = mockDyn({ sym, process, log });
      const results = commandLineFactory(dyn);
      const yargs = results.yargs;
      expect(yargs.argv.dump).to.be.true;
    });
    // Yargs provides support for --version and --help.
  });
});

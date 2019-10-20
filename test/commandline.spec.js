/**
 * trot:test/commandline.spec.js
 */

/**
 * Imports.
 */
const { expect } = require('chai');
const { commandLineFactory } = require('../src/commandline');
const { mockDyn } = require('./mocks/dynasty');
const { mockProcess } = require('./mocks/process');

/**
 * Shared test symbols.
 */
const sym = { };

/**
 * Test.
 */
describe('command line', () => {
    describe('commandLineFactory', () => {
        it('should be a function', () => {
            expect(commandLineFactory).to.be.a('function');
            expect(commandLineFactory.length).to.equal(1);
        });
        it('should process the command line', () => {
            const argv = [
                '/bin/node', '/tmp/testfile.js',
                '--list', 'build', '--dev'
            ];
            const process = mockProcess({ sym, argv });
            const dyn = mockDyn({ sym, process, });
            const results = commandLineFactory(dyn);
            expect(results.argv).to.deep.equal([
                '--list', 'build',
            ]);
            expect(results.runArgv).to.deep.equal([
                '--dev',
            ]);
            expect(results.yargs).to.be.an('object');
            const { '$0':runName, ...remainder } = results.yargs.argv;
            expect(runName).to.be.a('string');
            expect(remainder).to.deep.equal({
                _: [ 'build' ],
                'l': true,
                'list': true,
            });
        });
    });
});

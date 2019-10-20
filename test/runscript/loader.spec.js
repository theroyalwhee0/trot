/**
 * trot:test/RunType/loader.spec.js
 */

/**
 * Imports.
 */
const { expect } = require('chai');
const { spy } = require('sinon');
const { mockDyn } = require('../mocks/dynasty');
const { mockLog } = require('../mocks/log');
const { mockProcess } = require('../mocks/process');
const { RunType } = require('../../src/runtypes/base');
const { runScriptsLoaderFactory } = require('../../src/runscript/loader');

/**
 * Test.
 */
describe('RunType', () => {
  describe('loader', () => {
    describe('runScriptsLoaderFactory', () => {
      it('should be a function', () => {
        expect(runScriptsLoaderFactory).to.be.a('function');
        expect(runScriptsLoaderFactory.length).to.equal(1);
      });
      it('should load scripts', async () => {
        class ImaginaryFile extends RunType {
          constructor({ fullPath, contents }) {
            super({ fullPath, contents });
          }
          static get filename() {
            return 'imaginary.boop';
          }
          get filename() {
            return ImaginaryFile.filename;
          }
          parse(contents) {
            return {
              imaginaryFile: true,
              contents,
            };
          }
        }
        const RunTypeTypes = {
          imaginaryFile: ImaginaryFile,
        };
        const tryReadTextFile = spy(async function tryReadTextFile(fileName, noValue=null) {
          if(/\.boop$/.test()) {
            return 'boops';
          }
          return noValue;
        });
        const process = mockProcess();
        const log = mockLog();
        const dyn = mockDyn({
          log, process, tryReadTextFile, ...RunTypeTypes,
        });
        const RunTypesLoader = await runScriptsLoaderFactory(dyn);
        expect(RunTypesLoader).to.be.a('function');
        const results = [ ];
        for await (let item of RunTypesLoader()) {
          expect(item).to.be.an('object');
          results.push(item);
        }
        expect(results.length).to.equal(0);
        expect(tryReadTextFile.callCount).to.equal(1);
      });
    });
  });
});

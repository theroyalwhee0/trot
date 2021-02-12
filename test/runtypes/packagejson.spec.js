/**
 * trot:test/scriptlets/packagejson.spec.js
 */

/**
 * Imports.
 */
const { describe, expect, it } = require('../testing');
const { packageJsonFactory } = require('../../src/scriptlets/packagejson');
const { mockDyn } = require('../mocks/dynasty');

/**
 * Test.
 */
describe('@theroyalwhee0/trot', () => {
  describe('scriptlets', () => {
    describe('packageJsonFactory', () => {
      it('should be a function', () => {
        expect(packageJsonFactory).to.be.a('function');
        expect(packageJsonFactory.length).to.equal(1);
      });
      it('should create a scriptlet object', () => {
        const dyn = mockDyn();
        const scriptlet = packageJsonFactory(dyn);
        expect(scriptlet).to.be.an('object');
        expect(scriptlet.type).to.equal('package.json');
        expect(scriptlet.fileNames).to.be.an('array');
        expect(scriptlet.load).to.be.a('function');
      });
      it('should load from a JSON string', () => {
        const dyn = mockDyn();
        const scriptlet = packageJsonFactory(dyn);
        const context = {
          actions: [],
          env: {},
        };
        const fileName = 'package.json';
        const contents = `{
          "scripts": {
            "hello": "echo hello"
          }
        }`;
        scriptlet.load(context, { fileName, contents });
        expect(context.data).to.be.an('object');
        expect(context.actions).to.eql(['hello']);
        expect(context.env).to.eql({});
      });
    });
  });
});

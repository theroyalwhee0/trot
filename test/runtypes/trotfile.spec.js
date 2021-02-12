/**
 * trot:test/scriptlets/trotfile.spec.js
 */

/**
 * Imports.
 */
const { describe, expect, it } = require('../testing');
const { trotfileFactory } = require('../../src/scriptlets/trotfile');
const { mockDyn } = require('../mocks/dynasty');

/**
 * Test.
 */
describe('@theroyalwhee0/trot', () => {
  describe('scriptlets', () => {
    describe('trotfileFactory', () => {
      it('should be a function', () => {
        expect(trotfileFactory).to.be.a('function');
        expect(trotfileFactory.length).to.equal(1);
      });
      it('should create a scriptlet object', () => {
        const dyn = mockDyn();
        const scriptlet = trotfileFactory(dyn);
        expect(scriptlet).to.be.an('object');
        expect(scriptlet.type).to.equal('Trotfile');
        expect(scriptlet.fileNames).to.be.an('array');
        expect(scriptlet.load).to.be.a('function');
      });
      it('should load from a TOML string', () => {
        const dyn = mockDyn();
        const scriptlet = trotfileFactory(dyn);
        const context = {
          actions: [],
          env: {},
        };
        const fileName = 'Trotfile.toml';
        const contents = `
          [env]
          bird='crow'
          [actions]
          hello='echo hello'
        `;
        scriptlet.load(context, { fileName, contents });
        expect(context.data).to.be.an('object');
        expect(context.actions).to.eql(['hello']);
        expect(context.env).to.eql({
          bird:'crow',
        });
      });
      it('should load from a JSON string', () => {
        const dyn = mockDyn();
        const scriptlet = trotfileFactory(dyn);
        const context = {
          actions: [],
          env: {},
        };
        const fileName = 'Trotfile.json';
        const contents = `{
          "env": {
            "bird": "crow"
          },
          "actions": {
            "hello": "echo hello"
          }
        }`;
        scriptlet.load(context, { fileName, contents });
        expect(context.data).to.be.an('object');
        expect(context.actions).to.eql(['hello']);
        expect(context.env).to.eql({
          bird:'crow',
        });
      });
    });
  });
});

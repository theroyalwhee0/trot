/**
 * trot:src/runtypes/packagejson.js
 */

/**
 * Imports.
 */
const { spawn } = require('child_process');
const { RunType } = require('./base');

/**
 * Trotfile.toml factory.
 */
function packagejsonFactory() {
  class PackageJson extends RunType {
    static get filename() {
      return 'package.json';
    }
    get filename() {
      return PackageJson.filename;
    }
    parse(contents) {
      return JSON.parse(contents);
    }
    get actions() {
      return this.data.scripts || { };
    }
    get env() {
      return { };
    }
    async run({ actionName, args, log, cwd }) {
      const shell = 'npm';
      const env = Object.assign({}, process.env, this.env);
      const exitCode = await new Promise((resolve, reject) => {
        const spawnArgs = [ 'run', actionName, '--' ].concat(args);
        const shellSpawn = [ shell, ...spawnArgs ].join(' ');
        log.trace(`Running "${shellSpawn}".`);
        const child = spawn(shell, spawnArgs, {
          env, cwd,
          stdio: [ process.stdin, process.stdout, process.stderr ],
        });
        child.once('close', resolve);
        child.on('error', reject);
      });
      return exitCode;
    }
  }
  return PackageJson;
}

/**
 * Exports.
 */
module.exports = {
  packagejsonFactory,
};

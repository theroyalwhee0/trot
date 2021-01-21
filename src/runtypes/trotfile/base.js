/**
 * trot:src/runtypes/trotfile/base.js
 */

/**
 * Imports.
 */
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const { spawn } = require('child_process');
const { isObject } = require('@theroyalwhee0/istype');
const { RunType } = require('../base');
const { mkTempFile } = require('../../utility/files');
const exists = promisify(fs.exists);

/**
 * Template a shell string.
 */
function shellTemplate({ shell, tempFile, args }) {
  const spawnShell = shell.template[0];
  const spawnArgs = shell.template.slice(1).reduce((acc, value) => {
    if(isObject(value)) {
      if(value.args) {
        return acc.concat(args);
      } else if(value.script) {
        acc.push(tempFile.path);
      } else {
        throw new Error('Unknown shell argument.');
      }
    } else {
      acc.push(value);
    }
    return acc;
  }, [ ]);
  return {
    spawnShell, spawnArgs,
  };
}

/**
 * Trotfile base.
 */
class Trotfile extends RunType {
  static get type() {
    return 'Trotfile';
  }
  get actions() {
    return this.data.actions || { };
  }
  get env() {
    return this.data.env || { };
  }
  async run({ actionName, args, log, dump, cwd }) {
    const action = this.actions[actionName];
    const actionContents = isObject(action) ? action.action : ''+action;
    const shellType = isObject(action) ? action.shell : 'bash';
    const shell = this.shellTypes[shellType];
    if(!shell) {
      throw new Error(`Unsupported shell type "${shellType}" for "${actionName}".`);
    }
    const comments = shell.comment(`Action '${actionName}'`);
    const contents = `${shell.header}\n${comments}${actionContents}\n${shell.footer}\n`;
    const env = Object.assign({}, process.env, shell.env, this.env);
    const tempFile = await mkTempFile(contents);
    const { spawnShell, spawnArgs } = shellTemplate({
      shell, tempFile, args,
    });
    // If node_modules/.bin exists include it in the path.
    const nodeModules = path.join(cwd, 'node_modules/.bin');
    const nodeModulesExists = await exists(nodeModules);
    if(nodeModulesExists) {
      log.trace(`Including node_modules bin in path "${nodeModules}".`);
      env.PATH = env.PATH ? `${env.PATH}:${nodeModules}` : nodeModules ;
    }
    const logSpawn = [ spawnShell, ...spawnArgs ].join(' ');
    if(dump) {
      console.log(`> Action '${actionName}' from '${this.filename}':`);
      console.log(`\$ ${logSpawn}`);
      console.log('-----');
      console.log(contents);
      console.log();
      return { exitCode: 0 };
    }
    const exitCode = await new Promise((resolve, reject) => {
      log.trace(`Running "${logSpawn}".`);
      const child = spawn(spawnShell, spawnArgs, {
        env, cwd,
        stdio: [ process.stdin, process.stdout, process.stderr ],
      });
      child.once('close', resolve);
      child.on('error', reject);
    });
    return exitCode;
  }
}

/**
 * Exports.
 */
module.exports = {
  Trotfile,
};

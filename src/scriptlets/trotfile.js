/**
 * trot:src/scriptlets/trotfile.js
 */

/**
 * Imports.
 */
const { spawn:spawnLib } = require('child_process');
const fs = require('fs/promises');
const path = require('path');
const toml = require('toml');
const { isArray, isObject } = require('@theroyalwhee0/istype');
const { mkTempFile:mkTempFileLib } = require('../utility/files');

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
 * Trotfile factory.
 */
function trotfileFactory(dyn) {
  const { log, shellTypes, spawn=spawnLib, mkTempFile=mkTempFileLib } = dyn();

  /**
   * Load from contents.
   */
  function load(context, { fileName, contents }) {
    const isToml = fileName === 'Trotfile.toml';
    let data;
    if(isToml) {
      data = toml.parse(contents);
    } else {
      data = JSON.parse(contents);
    }
    context.data = data;
    if('actions' in data) {
      if(!isObject(data.actions)) {
        throw new Error(`'actions' should be an object`);
      }
      context.actions = Object.keys(data.actions);
    }
    if('env' in data) {
      if(!isObject(data.env)) {
        throw new Error(`'env' should be an object`);
      }
      context.env = Object.assign({}, data.env);
    }
    return context;
  }

  /**
   * Get source info for action.
   */
  function source(context, name) {
    const { data } = context;
    if('actions' in data) {
      if(name in data.actions) {
        return data.actions[name];
      }
    }
    return undefined;
  }

  /**
   * Get action groups for an action.
   */
  function getGroup(context, name) {
    const { data } = context;
    if('actions' in data && isArray(data.actions[name])) {
      return data.actions[name];
    }
    return false;
  }

  /**
   * Run an action.
   */
  async function run(context, { actionName, fullPath, args, dump, cwd }) {
    const action = context.data.actions[actionName];
    const actionContents = isObject(action) ? action.action : ''+action;
    const shellType = isObject(action) ? action.shell : 'bash';
    const shell = shellTypes[shellType];
    if(!shell) {
      throw new Error(`Unsupported shell type "${shellType}" for "${actionName}".`);
    }
    let contents = '';
    if('header' in shell) {
      contents += shell.header;
    }
    contents += shell.comment(`Action '${actionName}'`);
    contents += shell.body(actionContents);
    if('footer' in shell) {
      contents += shell.footer;
    }
    const env = Object.assign({}, process.env, shell.env, context.env);
    const tempFile = await mkTempFile(contents);
    const { spawnShell, spawnArgs } = shellTemplate({
      shell, tempFile, args,
    });
    // If node_modules/.bin exists include it in the path.
    const nodeModules = path.join(cwd, 'node_modules/.bin');
    const nodeModulesExists = await fs.access(nodeModules).then(() => true).catch(() => false);
    if(nodeModulesExists) {
      log.trace(`Including node_modules bin in path "${nodeModules}".`);
      env.PATH = env.PATH ? `${env.PATH}:${nodeModules}` : nodeModules ;
    }
    const logSpawn = [ spawnShell, ...spawnArgs ].join(' ');
    if(dump) {
      console.log(`> Action '${actionName}' from '${fullPath}':`);
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

  return {
    type: 'Trotfile',
    fileNames: [ 'Trotfile.toml', 'Trotfile.json' ],
    load, source, getGroup, run,
  };
}

/**
 * Exports.
 */
module.exports = {
  trotfileFactory,
};

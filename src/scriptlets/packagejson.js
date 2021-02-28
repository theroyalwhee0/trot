/**
 * trot:src/scriptlets/packagejson.js
 */

/**
 * Imports.
 */
const { spawn:spawnLib } = require('child_process');
const processLib=process;

/**
 * Package.json factory.
 */
function packageJsonFactory(dyn) {
  const { log, process=processLib, spawn=spawnLib } = dyn();
  /**
   * Load from contents.
   */
  function load(context, { contents }) {
    const data = JSON.parse(contents);
    context.data = data;
    if('scripts' in data) {
      context.actions = Object.keys(data.scripts);
    }
  }

  /**
   * Get source info for action.
   */
  function source(context, name) {
    const { data } = context;
    if('scripts' in data) {
      if(name in data.scripts) {
        return data.scripts[name];
      }
    }
    return undefined;
  }

  /**
   * Run an action.
   */
  async function run(context, { actionName, fullPath, args, cwd, dump }) {
    const shell = 'npm';
    const env = Object.assign({}, process.env, context.env);
    const exitCode = await new Promise((resolve, reject) => {
      const spawnArgs = [ 'run', actionName, '--' ].concat(args);
      const shellSpawn = [ shell, ...spawnArgs ].join(' ');
      if(dump) {
        const contents = context.data.scripts[actionName];
        console.log(`> Action '${actionName}' from '${fullPath}':`);
        console.log(`\$ ${shellSpawn}`);
        console.log('-----');
        console.log(contents);
        console.log();
        return { exitCode: 0 };
      }
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
  return {
    type: 'package.json',
    fileNames: ['package.json'],
    load, source, run,
    // NOTE: package.json does not support groups.
  };
}

/**
 * Exports.
 */
module.exports = {
  packageJsonFactory,
};

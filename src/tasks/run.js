/**
 * trot:src/tasks/run.js
 */

/**
 * Check to see if given actions are found in a runscript.
 */
function hasActions(runScript, actions) {
  const results = [ ];
  for(let idx=0; idx < actions.length; idx++) {
    results.push(actions[idx] in runScript.actions);
  }
  return results;
}

/**
 * Map requested actions to script runners.
 */
async function mapActionsToScriptRunners({ log, runScriptLoader, actionNames }) {
  let foundCount = 0;
  const actions = new Array(actionNames.length);
  for await (let runScript of runScriptLoader()) {
    const results = hasActions(runScript, actionNames);
    for(let idx=0; idx < actionNames.length; idx++) {
      const key = actionNames[idx];
      const found = results[idx];
      if(found && actions[idx] === undefined) {
        log.trace(`Found "${key}" action in "${runScript.fullPath}".`);
        actions[idx] = runScript;
        foundCount += 1;
      }
    }
  }
  if(foundCount !== actions.length) {
    // Report which actions were not found.
    const missing = [ ];
    for(let idx=0; idx < actionNames.length; idx++) {
      const key = actionNames[idx];
      const found = actions[idx];
      if(!found) {
        missing.push(key);
      }
    }
    log.error(`Actions "${missing.join(',')}" were not found.`);
    process.exit(1);
  }
  const mapped = { };
  for(let idx=0; idx < actionNames.length; idx++) {
    const actionName = actionNames[idx];
    mapped[actionName] = actions[idx];
  }
  return mapped;
}

/**
 * Run each given action.
 */
async function runEachAction({ log, actions, dump, context, args }) {
  let lastAction = {
    name: null,
    exitCode: null,
  };
  const cwd = process.cwd();
  for(let actionName in actions) {
    if(lastAction.exitCode !== null && lastAction.exitCode !== 0) {
      throw new Error(`Action "${lastAction.actionName}" has a non-zero exit code "${lastAction.exitCode}". Remaining actions skipped.`);
    }
    const action = actions[actionName];
    const exitCode = await action.run({ actionName, args, log, dump, context, cwd });
    lastAction = { actionName, exitCode };
  }
  process.exit(lastAction.exitCode);
}

/**
 * Run All factory.
 */
function runAllFactory(dyn) {
  const { log, runScriptLoader, commandLine } = dyn();
  return async function runAll({ actionNames, dump, context }) {
    if(typeof actionNames === 'string') {
      actionNames = actionNames.split(',');
    }
    const actions = await mapActionsToScriptRunners({ log, runScriptLoader, actionNames });
    await runEachAction({ log, actions, args: commandLine.runArgv, dump, context });
  };
}

/**
 * Exports.
 */
module.exports = {
  runAllFactory,
};

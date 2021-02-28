/**
 * trot:src/actions.js
 */

/**
 * Imports.
 */
const { isArray } = require('@theroyalwhee0/istype');
const { AppError } = require('./utility/exceptions');

/**
 * Resolve actions to scriptlets.
 */
async function resolveActions({ scriptlets, actions }) {
  if(!isArray(actions)) {
    actions = actions.split(',');
  }
  if(actions[actions.length-1] === '') {
    // If last item is blank then the actions list had a trailing comma. Drop it.
    actions = actions.slice(0, -1);
  }
  let resolved = [ ];
  for(let actionName of actions) {
    let items;
    for(let idx=0; idx < scriptlets.length; idx++) {
      const scriptlet = scriptlets[idx];
      const { scriptletType } = scriptlet;
      if(scriptlet.actions.includes(actionName)) {
        const group = scriptletType.getGroup && scriptletType.getGroup(scriptlet, actionName);
        if(group) {
          const groupResolved = await resolveActions({ scriptlets: [scriptlet], actions: group });
          items = resolved.concat([{ actionName, group }], groupResolved);
        } else {
          items = [{
            actionName, scriptlet,
          }];
        }
        break;
      }
    }
    if(items) {
      resolved = resolved.concat(items);
    } else {
      resolved.push({
        actionName,
        notFound: true,
      });
    }
  }
  return resolved;
}

/**
 * Run Actions factory.
 */
function runActionsFactory(dyn) {
  const { log, loadScriptlets } = dyn();
  return async function runActions({ actions, recursive, dump, cwd, args }) {
    // Load all available scriptlet files.
    const scriptlets = await loadScriptlets({ cwd, recursive });
    // Resolve actions, including actions that resolve to other actions.
    const resolvedActions = await resolveActions({ scriptlets, actions });
    // Figure out any actions that are missing.
    const missing = resolvedActions.filter((item) => item.notFound).map((item) => item.actionName);
    if(missing.length) {
      throw new AppError(`Action${missing.length > 1 ? 's' : ''} "${missing.join(', ')}" not found.`);
    }
    let exitCode = 0;
    for(let idx=0; idx < resolvedActions.length; idx++) {
      const resolved = resolvedActions[idx];
      const { actionName, group, scriptlet  } = resolved;
      if(group) {
        // Groups have already been resolved, just trace to simplify debugging.
        log.trace(`Action '${actionName}' resolved to groups '${group.join(',')}'.`);
        continue;
      }
      const { relative, fileName, scriptletType, fullPath, fullFolder } = scriptlet;
      log.info(`Running action '${actionName}' from '${relative ? relative + '/' : ''}${fileName}'.`);
      exitCode = await scriptletType.run(scriptlet, { actionName, fullPath, fullFolder, args, cwd, dump });
      log.trace(`Finished running action '${actionName}'.`);
      if(exitCode !== 0 && idx+1 < resolvedActions.length) {
        log.warn(`'${actionName}' had a non-zero exit code. Skipping remaining actions.`);
        break;
      }
    }
    return exitCode;
  };
}

/**
 * Exports.
 */
module.exports = {
  runActionsFactory,
};

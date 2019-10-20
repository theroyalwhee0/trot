/**
 * trot:src/tasks/list.js
 */

/**
 * Imports.
 */
const chalkLib = require('chalk');
const { isString } = require('@theroyalwhee0/istype');

/**
 * ListAll factory.
 */
function listAllFactory(dyn) {
  const { runScriptLoader, chalk=chalkLib } = dyn();
  const cyan = chalk.cyan;
  const darkGreen = chalk.green;
  const green = chalk.bold.green;
  const darkYellow = chalk.yellow;
  const yellow = chalk.bold.yellow;

  function serializeAction(value, name) {
    if(isString(value)) {
      if(/[\n\r]/g.test(value)) {
        const tab = ' '.repeat(name.length+1);
        let split = value.split(/[\n\r]/g);
        if(split[0] === '') {
          split = split.slice(1);
        }
        if(split[split.length-1] === '') {
          split = split.slice(0, -1);
        }
        const multiline = split.map((value, idx) => {
          if(idx === 0) {
            return value;
          } else {
            return ` ${darkGreen('|')}${tab}${value}`;
          }
        });
        return multiline.join('\n');
      } else {
        return value;
      }
    } else {
      return JSON.stringify(value);
    }
  }

  return async function listAll() {
    for await (let runScript of runScriptLoader()) {
      console.log(`${darkYellow('[')} ${yellow(runScript.filename)} ${darkYellow(']')}`);
      for(let actionName in runScript.actions) {
        const action = runScript.actions[actionName];
        console.log(`${cyan(actionName)} ${green('=')} ${serializeAction(action, actionName)}`);
      }
      console.log('');
    }
  };
}

/**
 * Exports.
 */
module.exports = {
  listAllFactory,
};

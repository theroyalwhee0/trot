/**
 * trot:src/list.js
 */

/**
 * Imports.
 */
const chalkLib = require('chalk');
const { isString } = require('@theroyalwhee0/istype');

/**
 * Show List factory.
 */
function showListFactory(dyn) {
  const { loadScriptlets, chalk=chalkLib } = dyn();

  // Colors.
  const cyan = chalk.cyan;
  const darkGreen = chalk.green;
  const green = chalk.bold.green;
  const darkYellow = chalk.yellow;
  const yellow = chalk.bold.yellow;

  // Write.
  const writeln = console.log;

  /**
   * Serialize an action value.
   */
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

  /**
   * Show List.
   */
  return async function showList({ cwd, recursive=false }={}) {
    const scriptlets = await loadScriptlets({ cwd, recursive });
    for(let scriptlet of scriptlets) {
      const { scriptletType } = scriptlet;
      const folder = scriptletType.relative ? scriptlet.relative + '/' : '';
      writeln(`${darkYellow('[')} ${yellow(folder + scriptlet.fileName)} ${darkYellow(']')}`);
      for(let actionName of scriptlet.actions) {
        const action = scriptletType.source(scriptlet, actionName);
        const serialized = serializeAction(action, actionName);
        writeln(`${cyan(actionName)} ${green('=')} ${serialized}`);
      }
      writeln('');
    }
  };
}

/**
 * Exports.
 */
module.exports = {
  showListFactory,
};

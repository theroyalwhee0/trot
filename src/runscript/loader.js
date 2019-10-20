/**
 * trot:src/runscript/loader.js
 */

/**
 * Imports.
 */
const path = require('path');
const { tryReadTextFile:tryReadTextFileLib } = require('../utility/files');
const processLib = process;

/**
 * RunScript Loader factory.
 */
function runScriptsLoaderFactory(dyn) {
  const { log, process=processLib, tryReadTextFile=tryReadTextFileLib, ...runScriptTypes } = dyn();
  return async function* runScriptsLoader(folder) {
    folder = folder || process.cwd();
    // For each runScript type...
    for(let key in runScriptTypes) {
      const RunScript = runScriptTypes[key];
      // Read the contents of the file.
      const fullPath = path.resolve(folder, RunScript.filename);
      const contents = await tryReadTextFile(fullPath);
      // If the file exists...
      if(contents !== null) {
        log.trace(`Found ${RunScript.filename} at "${fullPath}".`);
        // Build a RunScript from it.
        yield new RunScript({ fullPath, contents });
      }
    }
  };
}

/**
 * Exports.
 */
module.exports = {
  runScriptsLoaderFactory,
};

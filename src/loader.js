/**
 * trot:src/scriptlets.js
 */

/**
 * Imports
 */
const path = require('path');
const fsLib = require('fs/promises');
const { tryReadTextFile } = require('./utility/files');

/**
 * Constants.
 */
const ignoreFolders = ['node_modules'];

/**
 * Load Scriptlet Files factory.
 */
function loadScriptletsFactory(dyn) {
  const { log, scriptletTypes, fs=fsLib } = dyn();
  // Create fileName -> scriptlet type mapping.
  const [ fileNames, scriptletTypeList ] = Object.keys(scriptletTypes).reduce(([ fileNames, scriptletTypeList ], key) => {
    const scriptletType = scriptletTypes[key];
    for(let idx=0; idx < scriptletType.fileNames.length; idx++) {
      fileNames.push(scriptletType.fileNames[idx]);
      scriptletTypeList.push(scriptletType);
    }
    return [ fileNames, scriptletTypeList ];
  }, [[], []]);
  /**
   * Load Scriplet files.
   */
  return async function loadScriptlets({ rootFolder, folder, cwd, recursive=false }={}) {
    folder = folder || cwd;
    rootFolder = rootFolder || folder;
    let loaded = [];
    for(let idx=0; idx < fileNames.length; idx++) {
      const fileName = fileNames[idx];
      const fullPath = path.resolve(folder, fileName);
      const [ contents, found ] = await tryReadTextFile(fullPath, fs);
      if(found) {
        const fullFolder = path.dirname(fullPath);
        const scriptletType = scriptletTypeList[idx];
        const relativePath = path.relative(rootFolder, fullPath);
        log.debug(`Found '${scriptletType.type}' at '${relativePath}`);
        const context = {
          scriptletType, fileName, fullPath, fullFolder,
          relative: path.relative(rootFolder, path.resolve(fullPath, '..')),
          env: {}, actions: [],
        };
        loaded.push(context);
        await scriptletType.load(context, { fileName, contents });
      }
    }
    if(recursive) {
      const folders = await fs.readdir(folder, { withFileTypes: true });
      for(let entry of folders) {
        if(!entry.isDirectory()) {
          // Ignore anything by directories.
          continue;
        }
        if(ignoreFolders.includes(entry.name)) {
          // Ignore folders in ignore list.
          log.trace(`Skipping '${entry.name}' during recursive scan.`);
          continue;
        }
        const subloaded = await loadScriptlets({
          rootFolder, recursive,
          folder: path.resolve(folder, entry.name),
        });
        loaded = loaded.concat(subloaded);
      }
    }
    return loaded;
  };
}

/**
 * Exports.
 */
module.exports = {
  loadScriptletsFactory,
};

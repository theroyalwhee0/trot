/**
 * trot:src/shelltypes/index.js
 */

/**
 * ShellType factory.
 */
function shellTypeFactory(dyn) {
  const { log, ...types } = dyn();
  const shellTypes = { };
  for(let typeName in types) {
    const Type = types[typeName];
    const type = new Type();
    shellTypes[type.name] = type;
  }
  return shellTypes;
}

/**
 * Exports.
 */
module.exports = {
  shellTypeFactory,
};

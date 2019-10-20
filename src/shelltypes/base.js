/**
 * trot:src/shelltypes/base.js
 */

/**
 * ShellType base class.
 */
class ShellType {
  get name() {
    return '';
  }

  get template() {
    return [ ];
  }

  get header() {
    return '';
  }

  get footer() {
    return '';
  }

  get env() {
    return null;
  }
}

// Static.
Object.assign(ShellType, {
  TPL_ARGS: { args: true },
});

/**
 * Exports.
 */
module.exports = {
  ShellType,
};

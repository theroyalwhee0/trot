/**
 * trot:src/application.js
 */

/**
 * Application factory.
 */
async function applicationFactory(dyn) {
    const { commandLineActions, log } = dyn();
    log.debug('Application started.');
    await commandLineActions();
}

/**
 * Exports.
 */
module.exports = {
    applicationFactory,
};

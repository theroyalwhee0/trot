/**
 * trot:src/envconfig.js
 */

/**
 * Imports.
 */
const path = require('path');
const chalkLib = require('chalk');
const mkdirpLib = require('mkdirp');
const childprocessLib = require('child_process');

/**
 * Configure Environment factory.
 */
function configureEnvironmentFactory(dyn) {
    const { log, childprocess=childprocessLib, mkdirp=mkdirpLib, chalk=chalkLib } = dyn();
    const gray = chalk.white;
    const white = chalk.bold.white;
    const darkYellow = chalk.yellow;
    const yellow = chalk.bold.yellow;
    async function which(name) {
        const results = await new Promise((resolve, reject) => {
            let filePath = '';
            const process = childprocess.spawn('which', [ name ], {
            });
            process.stdout.on('data', (data) => {
                filePath += data.toString().replace(/[\n\r]$/, '')
            });
            process.on('close', (code) => {
                if(code === 0 || code === 1) {
                    const found = !code;
                    return resolve({
                        found, filePath
                    });
                } else {
                    return reject(new Error(`Exit code ${code}`));
                }
            })
        });
    }

    return async function configureEnvironment() {
        console.log(`${darkYellow('[')} ${yellow('Configure Environment')} ${darkYellow(']')}`);
        console.log(`${gray('-')} ${white('The configuration feature is disabled as it is a work-in-progress.')}`);
        // const config = { };
        // const folder = path.resolve(process.env.HOME, '.Trot');
        // log.trace({ folder }, '.Trot folder');
        // await mkdirp(folder);
        // // *nix shells.
        // await which('sh');
        // await which('bash');
        // await which('dash');
        // // Scripting languages.
        // await which('python');
        // await which('python2');
        // await which('python3');
        // await which('perl');
        // await which('node');
        // TODO: Investigate pgsql, sftp, and similar programs as shells.
        // console.log(`${gray('-')} ${white('Configuration complete.')}`);
    };
}

/**
 * Exports.
 */
module.exports = {
    configureEnvironmentFactory,
};

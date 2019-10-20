/**
 * trot:src/runtypes/trotfile/base.js
 */

/**
 * Imports.
 */
const { spawn } = require('child_process');
const { isObject } = require('@theroyalwhee0/istype');
const { RunType } = require('../base');
const { mkTempFile } = require('../../utility/files');

/**
 * Template a shell string.
 */
function shellTemplate({ shell, tempFile, args, }) {
    const spawnShell = shell.template[0];
    const spawnArgs = shell.template.slice(1).reduce((acc, value) => {
        if(isObject(value)) {
            if(value.args) {
                return acc.concat(args);
            } else if(value.script) {
                acc.push(tempFile.path);
            } else {
                throw new Error('Unknown shell argument.');
            }
        } else {
            acc.push(value);
        }
        return acc;
    }, [ ]);
    return {
        spawnShell, spawnArgs,
    };
}

/**
 * Trotfile base.
 */
class Trotfile extends RunType {
    static get type() {
        return 'Trotfile';
    }
    get actions() {
        return this.data.actions || { };
    }
    get env() {
        return this.data.env || { };
    }
    async run({ actionName, args, log }) {
        const action = this.actions[actionName];
        const actionContents = isObject(action) ? action.action : ''+action;
        const shellType = isObject(action) ? action.shell : 'bash';
        const shell = this.shellTypes[shellType];
        if(!shell) {
            throw new Error(`Unsupported shell type "${shellType}" for "${actionName}".`);
        }
        const comments = shell.comment(`Action '${actionName}'`);
        const contents = `${shell.header}\n${comments}${actionContents}\n${shell.footer}\n`;
        const env = Object.assign({}, process.env, shell.env, this.env);
        const tempFile = await mkTempFile(contents);
        const exitCode = await new Promise((resolve, reject) => {
            const { spawnShell, spawnArgs } = shellTemplate({
                shell, tempFile, args,
            });
            const logSpawn = [ spawnShell, ...spawnArgs ].join(' ');
            log.trace(`Running "${logSpawn}".`);
            const child = spawn(spawnShell, spawnArgs, {
                env,
                stdio: [process.stdin, process.stdout, process.stderr],
            });
            child.once('close', resolve);
            child.on('error', reject);
        });
        return exitCode;
    }
}

/**
 * Exports.
 */
module.exports = {
    Trotfile,
};

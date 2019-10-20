/**
 * trot:src/files.js
 */

/**
 * Imports.
 */
const fs = require('fs');
const { readFile } = require('fs').promises;
const tmp = require('tmp');

/**
 * Static init.
 */
// TODO: Dirty, find a better way.
tmp.setGracefulCleanup();

/**
 * Make temporary file with optional contents.
 */
async function mkTempFile(contents) {
  const tempFile = await new Promise((resolve, reject) => {
    const options = {
      prefix: 'trot_',
    };
    tmp.file(options, (err, path, fd) => {
      if(err) {
        return reject(err);
      }
      return resolve({ path, fd });
    });
  });
  if(contents) {
    await new Promise((resolve, reject) => {
      fs.write(tempFile.fd, contents, (err) => {
        if(err) {
          return reject(err);
        } else {
          return resolve();
        }
      });
    });
  }
  return tempFile;
}

/**
 * Try to read a text file, if not found return noValue.
 */
async function tryReadTextFile(fileName, noValue=null) {
  try {
    return await readFile(fileName, 'utf8');
  } catch(ex) {
    if(ex instanceof Error && ex.code === 'ENOENT') {
      return noValue;
    }
    throw ex;
  }
}

/**
 * Exports.
 */
module.exports = {
  tryReadTextFile, mkTempFile,
};

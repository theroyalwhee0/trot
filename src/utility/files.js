/**
 * trot:src/utility/files.js
 */

/**
 * Imports.
 */
const fs = require('fs');
const { readFile } = require('fs').promises;
const tmp = require('tmp');

/**
 * Make temporary file with optional contents.
 */
let mkTempFileSetup = false;
async function mkTempFile(contents) {
  if(!mkTempFileSetup) {
    mkTempFileSetup = true;
    tmp.setGracefulCleanup();
  }
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
 * Try to read a text file.
 */
async function tryReadTextFile(fileName, fs) {
  try {
    const contents = await fs.readFile(fileName, 'utf8');
    return [ contents, true ];
  } catch(ex) {
    if(ex instanceof Error && ex.code === 'ENOENT') {
      return [ undefined, false ];
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

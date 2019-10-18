const fs = require("fs");
const { exec } = require("child_process");

/**
 * Executes a program and returns a promise with the stdout
 * @param {string} command
 * @param {string[]} args
 * @param {ExecOptions} options
 */
const execPromise = (command, args, options) => new Promise((resolve, reject) => {
    const child = exec([command, ...args].join(' '), options, (err, stdout, stderr) => {
        if(!err) {
            resolve(stdout);
        }
    });

    child.stderr.on('data', function (data) {
        console.error(data.toString());
    });
    child.once("exit", (code, signal) => {
        if(code) {
            reject({code});
        }
    });
});

/**
 * 
 * @param {string} existingPath
 * @param {string} newPath
 * @returns {Promise<void>}
 */
const symlinkPromise = (existingPath, newPath) => new Promise((resolve, reject) => {
    fs.symlink(existingPath, newPath, (err) => {
        if (err) {
            reject(err);
        } else {
            resolve();
        }
    })
});


module.exports = {
    execPromise, symlinkPromise
}
const chalk = require('chalk');
const { Subject } = require('rxjs');
const { debounceTime } = require('rxjs/operators');
const electron = require('electron-connect').server.create();

const electron$ = (function() {
    let started = false;
    const subject = new Subject();

    // Listen actions
    subject.pipe(
        // debounceTime(1000)
    ).subscribe(({isMain, start, electronArgs}) => {
        if(!started) {
            if(start) {
                console.log(chalk.yellow.bold("[!] Starting electron!", `electron ${electronArgs.join(' ')}`));
                electron.start(electronArgs);
                started = true;
            }
        } else if(isMain) {
            console.log(chalk.yellow.bold("[!] Restart electron!"));
            electron.restart();
        } else {
            console.log(chalk.yellow.bold("[!] Reload electron!"));
            electron.reload();
        }
    });

    return subject;
})();

module.exports = function(pluginOptions) {
    pluginOptions = pluginOptions || {};

    const isMain = pluginOptions.main || false;
    const start = pluginOptions.start || false;
    const electronArgs = pluginOptions.electronArgs || [];
    const plugin = {
        name: "Electron",
        writeBundle() {
            electron$.next({
                isMain,
                start,
                electronArgs
            });
        }
    }
    return plugin;
};

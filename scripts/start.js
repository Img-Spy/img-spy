const rollup = require('rollup');
const chalk = require('chalk');
const path = require('path');

const srcPackage = require("../src/package.json");
const root = path.resolve(__dirname, "..");


// Main
(async () => {
    const distPath = path.resolve(root, 'dist');
    const jsPath = path.resolve(distPath, 'assets/js');
    const pluginsPath = path.resolve(distPath, 'assets/plugins');
    const tskPath = path.resolve(root, 'src/node_modules/tsk-js');

    Object.assign(process.env, {
        IMGSPY_BUNDLE_FILE: path.resolve(jsPath, "img-spy.js"),
        IMGSPY_MAIN_PATH: distPath,
        IMGSPY_UI_PATH: distPath,
        IMGSPY_WORKERS_PATH: jsPath,
        IMGSPY_PLUGINS_PATH: pluginsPath,
        IMGSPY_TSK_PATH: tskPath
    });

    watch();
})();


/////////

function prepareWatchers(rollupConfigs) {
    return rollupConfigs.map(rollupConfig => {
        if (typeof rollupConfig === 'string') {
            if (!srcPackage.dependencies[rollupConfig]) {
                console.error(`Cannot find package ${rollupConfig}`);
                process.exit(-1);
            }
            const rollupConfigPath = path.resolve(
                root, "src", srcPackage.dependencies[rollupConfig].substring(5),
                "rollup.config"
            );
            return require(rollupConfigPath);
        }
        return rollupConfig;
    });
}

function clear() {
    let lines = process.stdout.getWindowSize()[1];
    for (let i = 0; i < lines; i++) {
        console.log('\r\n');
    }
    console.clear();
}


function printError(event) {
    console.log(chalk.red.bold(`[!] Fatal error ${event.error.code}`));
    if (event.error.loc) {
        console.log(chalk.cyan(event.error.url));
        console.log(`${event.error.loc.file}:${event.error.loc.line}:${event.error.loc.column}`);
        console.log(chalk.gray(event.error.frame));
    }
    console.log(chalk.gray(event.error.stack));
}


function bundleName({ input, output }) {
    if (typeof input === 'object') {
        input = Object.keys(input).map(key => input[key]).join(', ')
    }
    if (typeof output === 'object') {
        output = output.join(', ');
    }

    return `${input} --> ${output}`
}

function watch() {
    const watchOptions = prepareWatchers([
        // Packages
        "img-spy-core",
        "img-spy-api",
        "img-spy-material",
        "img-spy-modules",
        "img-spy-navigation",
        "img-spy-resize",

        // Bundles
        require('../src/bundles/rollup.config'),

        // Plugins
        "img-spy-plugin-explorer",
        "img-spy-plugin-search",
        "img-spy-plugin-timeline",

        // Processes
        "img-spy-main",
        "img-spy-ui",
        "img-spy-workers"
    ]);
    const watcher = rollup.watch(watchOptions);

    watcher.on('event', event => {
        switch (event.code) {
            case 'START':
                console.log(chalk.gray('Change detected'));
                break;
            case 'BUNDLE_START':
                console.log(chalk.cyan.bold(`Start build bundles from file '${bundleName(event)}'`));
                break;
            case 'BUNDLE_END':
                console.log(chalk.green.bold(`Bundles from file '${bundleName(event)}' finished in ${event.duration / 1000}s`));
                break;
            case 'END':
                console.log(chalk.gray('Finished'));
                console.log(chalk.bold('Watching files...'));
                break;

            case 'ERROR':
                console.log(`Event ${event.code}`);
                console.log(event);
                break;
            case 'FATAL':
                printError(event);
                break;

            default:
                console.log(`Event ${event.code}`);
        }
    });

    console.log(chalk.bold('Watching files...'));
}

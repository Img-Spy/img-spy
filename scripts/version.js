const yargs = require("yargs");
const path = require("path");
const fs = require("fs");

const root = path.resolve(__dirname, '..');
const package = require("../package.json");
const srcPackage = require("../src/package.json");
const globalVersionName = "$GLOBAL$";


function check(argv) {

    // Build versions array
    const versions = Object.keys(srcPackage.dependencies)
        .filter(key => key.startsWith('img-spy-'))
        .map((key) => {
            const depPackagePath = path.resolve(
                root, "src", srcPackage.dependencies[key].substring(5), 'package.json'
            );
            const depPackage = require(depPackagePath);
            return {
                name: key,
                version: depPackage.version
            };
        });
    versions.unshift({
            name: 'img-spy',
            version: package.version
        }, {
            name: 'img-spy-src',
            version: srcPackage.version
        });

    // Check versions
    versions.reduce((prev, curr) => {
        if(argv.verbose) {
            console.log(`${curr.name}@${curr.version}`);
        }

        if(!prev) {
            return curr;
        }
        if(prev.version !== curr.version) {
            console.log(`Versions are inconsistent [${curr.name}:${curr.version}/${prev.name}:${prev.version}]`);
            process.exit(-1);
        }
        return prev;
    }, null);

    console.log('Versions are correct');
}

function set(argv) {
    // Load package.json files
    const packages = Object.keys(srcPackage.dependencies)
        .filter(key => key.startsWith('img-spy-'))
        .map((key) => {
            const depPackagePath = path.resolve(
                root, "src", srcPackage.dependencies[key].substring(5), 'package.json'
            );
            return { 
                filePath: depPackagePath,
                packageJson: require(depPackagePath)
            };
        });

    packages.unshift({
        filePath: path.resolve(root, 'package.json'),
        packageJson : package
    }, {
        filePath: path.resolve(root, 'src/package.json'),
        packageJson : srcPackage
    });

    // Prepare version updater
    const values = (Array.isArray(argv.values) ? argv.values : [argv.values]).map((value) => {
        let [ name, version ] = value.split('@');
        let isGlobal = false;
        if(!version) {
            version = name;
            name = globalVersionName;
            isGlobal = true;
        }
        return { name, version, isGlobal };
    });
    
    // Update versions and store
    packages.forEach(({filePath, packageJson}) => {
        values.forEach(value => {
            if(value.isGlobal) {
                packageJson.version = value.version;
                return;
            }

            if(packageJson.dependencies[value.name]) {
                packageJson.dependencies[value.name] = value.version;
                return;
            }

            if(packageJson.devDependencies[value.name]) {
                packageJson.devDependencies[value.name] = value.version;
                return;
            }
        });

        // Write new package.json
        fs.writeFileSync(
            filePath,
            JSON.stringify(packageJson, null, "  ")
        );
    });
}

!function main() {
    const argv = yargs
        .command('check', 'Check the version of the dependencies', (yargs) => {
            yargs
                .option('verbose', {
                    alias: 'v',
                    type: 'boolean',
                    default: false,
                    description: 'Show more information'
                })
        })
        .command('set', 'Set a version for a selected package', (yargs) => {
            yargs
                .option('values', {
                    alias: 's',
                    description: 'Version to set. Use package@version to specify the version of a dependency.'
                })
        })
        .help()
        .alias('help', 'h')
        .argv;

    const command = argv._[0];
    switch(command) {
        case "check":
            check(argv);
            break;
        case "set":
            set(argv);
            break;
        default:
            console.error("error: No valid command provided.\n");
            yargs.showHelp();
            break;
    }

}()

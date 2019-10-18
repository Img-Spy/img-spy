const path = require("path");
const { spawnSync } = require("child_process");
const rimraf = require("rimraf");

const package = require("../src/package.json");
const root = path.resolve(__dirname, "..");

const { symlinkPromise, execPromise } = require("./lib");


const prepareDependencies = async () => {
    console.log(`Prepare dependencies`);
    for(key in package.dependencies) {
        const srcPath = path.resolve(
            root, "src"
        );
        const depPath = path.resolve(
            srcPath, package.dependencies[key].substring(5)
        );
        const depLinkPath = path.resolve(
            root, "src/node_modules", key
        );
        const depPackagePath = path.resolve(
            depPath, "package.json"
        );
        const depPackage = require(depPackagePath);

        console.log(`    - ${key}`);
        rimraf.sync(depLinkPath);
        await execPromise("yarn", ["link"], {
            cwd: depPath
        });
        await execPromise("yarn", ["link", key], {
            cwd: srcPath
        });
        // await symlinkPromise(depPath, depLinkPath).catch(err => {
        //     console.error(err.stack);
        //     process.exit(-1);
        // });
        if(depPackage.scripts && depPackage.scripts.prepare) {
            await execPromise("yarn", ["prepare"], {
                cwd: depPath
            });
        }

        rimraf.sync(path.resolve(depPath, 'node_modules'));
    }
};

const rebuild = async () => {    
    console.log(`Rebuild binaries to match electron node version`);
    await execPromise("yarn", ["rebuild"], {
        cwd: path.resolve(root, "src")
    });
}


!async function main() {
    await prepareDependencies();
    await rebuild();
}()

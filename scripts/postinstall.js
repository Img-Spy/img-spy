const path = require("path");
const { spawnSync } = require("child_process");
const rimraf = require("rimraf");

const package = require("../src/package.json");
const root = path.resolve(__dirname, "..");

console.log(`Prepare dependencies`);
Object.keys(package.dependencies).forEach(key => {
    const depPath = path.resolve(
        root, "src", package.dependencies[key].substring(5)
    );
    let status;

    console.log(`    - ${key}`);
    status = spawnSync("yarn", ["link"], {
        cwd: depPath,
        stdio: "ignore"
    });
    if(status.error) {
        console.error(`Error while creating the link for "${key}"`);
    }

    spawnSync("yarn", ["link", key], {
        cwd: path.resolve(root, "src"),
        stdio: "ignore"
    });

    rimraf.sync(path.resolve(depPath, 'node_modules'));
});

console.log(`Rebuild binaries to match electron node version`);
spawnSync("yarn", ["rebuild"], {
    cwd: path.resolve(root, "src"),
    stdio: "inherit"
});

const path = require("path");
const fs = require("fs");
const { spawnSync } = require("child_process");

const package = require("../src/package.json");
const root = path.resolve(__dirname, "..");


// Merge devDependencies
const devDependencies = Object.keys(package.dependencies).map(key => {
    const depPath = path.resolve(
        root, "src", package.dependencies[key].substring(5)
    );

    const depPackage = require(`${depPath}/package.json`);
    return {
        name: key,
        devDependencies: depPackage.devDependencies 
    };
}).reduce((prev, curr) => {
    if(!curr.devDependencies) {
        return prev;
    }

    Object.keys(curr.devDependencies).forEach(key => {
        const currDependency = curr.devDependencies[key]
        if(prev[key] && prev[key] !== currDependency) {
            console.log(`Check dev dependencies! They are inconsistent [${curr.name}.${key}:${currDependency}/global.${key}:${prev[key]}]`);
            process.exit(-1);
        }
        prev[key] = currDependency;
    });
    return prev;
}, {});

// Sort devDependencies
package.devDependencies = Object.keys(devDependencies).reduce((prev, curr) => {
    prev[curr] = devDependencies[curr];
    return prev;
}, {
    // Default dependencies
    "electron-rebuild": "^1.8.6",
});

// Write new package.json
fs.writeFileSync(
    path.resolve(root, "src/package.json"),
    JSON.stringify(package, null, "  ")
);

// Start package installation
console.log("Running yarn install for whole monorepo");
spawnSync("yarn", {
    cwd: path.resolve(root, "src"),
    stdio: "ignore"
});
spawnSync("yarn", {
    cwd: path.resolve(root, "dist"),
    stdio: "ignore"
});

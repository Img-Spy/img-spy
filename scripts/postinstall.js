const path = require("path");
const { spawnSync } = require("child_process");

const package = require("../src/package.json");
const root = path.resolve(__dirname, "..");

Object.keys(package.dependencies).forEach(key => {
    const depPath = path.resolve(
        root, "src", package.dependencies[key].substring(5)
    );
    let status;

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

    spawnSync("yarn", ["rebuild"], {
        cwd: path.resolve(root, "src"),
        stdio: "ignore"
    });

    spawnSync("bash", ["-c", `
        find -maxdepth 4 -path "./src/packages/*/node_modules" -or -path "./src/plugins/*/node_modules" -or -path "./src/processes/*/node_modules" | xargs rm -rf
    `])
});

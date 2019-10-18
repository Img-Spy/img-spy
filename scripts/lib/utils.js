const package = require("../../src/package.json");


const forEachDependency = async (callback) => {
    for(key in package.dependencies) {
        const dep = {
            name: key,
            path: path.resolve(
                root, "src", package.dependencies[key].substring(5)
            )
        };
        const depPackagePath = path.resolve(
            dep.path, "package.json"
        );

        dep.package = require(depPackagePath);
        
        const ret = callback(dep);
        if(ret instanceof Promise) {
            await ret;
        }
    }
}



module.exports = {
    forEachDependency
}
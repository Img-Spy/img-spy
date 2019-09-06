import * as path            from "path";
import * as fs              from "fs";
import loadExternal         from "./load-external";
// import { app, remote }      from "electron";


function appRootPath(): string {
    let dirname = __dirname;

    do {
        const packageFile = path.resolve(dirname, "./imgspy.json");
        if(fs.existsSync(packageFile)) {
            break;
        }

        dirname = path.resolve(dirname, "..");
    } while(dirname != "/")

    return dirname;
}

export default appRootPath();

import * as fs                  from "fs";
import * as path                from "path";
import { Action }               from "redux";

import { Plugin }               from "../plugin";

import { environment }          from "../../env";
import { PluginPackage }        from "./plugin-package";
import { PluginEntry }          from "./plugin-entry";
import { PluginBuilder }        from "../plugin-builder";


export default class PluginLoader {

    constructor(private pluginPath: string) {}

    public get list(): Array<string> {
        return fs.readdirSync(this.pluginPath);
    }

    private loadPackage(dirName: string): PluginPackage {
        const packagePath = path.join(this.pluginPath, `./${dirName}/package.json`);
        if(!fs.existsSync(`${packagePath}`)) {
            console.warn(`[${dirName}*] Do not has package.json. Skipping.....`);
            return undefined;
        }

        return environment.loadExternal(packagePath);
    }

    private loadBuilder<State>(
        dirName: string, pluginPackage: PluginPackage
    ): PluginBuilder<State> {
        if(!pluginPackage.imgspy) {
            console.warn(`[${dirName}*] Do not has the imgspy property defined on it's package.json. Skipping.....`);
            return undefined;
        }

        if(!pluginPackage.imgspy.name) {
            console.warn(`[${dirName}*] Do not has the imgspy property defined on it's package.json. Using <directory name>* as name`);
            pluginPackage.imgspy.name = `${dirName}*`
        }

        return new PluginBuilder<State>(pluginPackage, this.pluginPath, dirName);
    }

    public load<State>(dirName: string): Plugin<State> {
        const pluginPackage = this.loadPackage(dirName);
        if(!pluginPackage) {
            return undefined;
        }

        const pluginBuilder = this.loadBuilder<State>(dirName, pluginPackage);
        if(!pluginBuilder) {
            return undefined;
        }

        return pluginBuilder.build();
    }

    public loadAll<State = Action>(): Array<Plugin<State>> {
        return this.list
            .map((name) => this.load<State>(name))
            .filter(p => !!p);
    }
}

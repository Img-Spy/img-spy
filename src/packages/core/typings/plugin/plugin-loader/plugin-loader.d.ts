import { Action } from "redux";
import { Plugin } from "../plugin";
export default class PluginLoader {
    private pluginPath;
    constructor(pluginPath: string);
    readonly list: Array<string>;
    private loadPackage;
    private loadBuilder;
    load<State>(dirName: string): Plugin<State>;
    loadAll<State = Action>(): Array<Plugin<State>>;
}

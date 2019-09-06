import { Plugin } from "../plugin";
import { PluginPackage } from "../plugin-loader";
import { Builder } from "./builder";
export declare class PluginBuilder<State> implements Builder<Plugin> {
    readonly pluginPackage: PluginPackage;
    readonly pluginPath: string;
    readonly pluginDirName: string;
    constructor(pluginPackage: PluginPackage, pluginPath: string, pluginDirName: string);
    build(): Plugin<State>;
}

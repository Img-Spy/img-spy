import { PluginInfo } from "./info";
import { PluginView } from "./view";
import { PluginWorkers } from "./workers";
export interface Plugin<State = any> {
    readonly info: PluginInfo;
    readonly view: PluginView<State>;
    readonly workers: PluginWorkers;
}

import { PluginBuilder } from "../plugin-builder";

export interface PluginEntry<State> {
    activate(pluginBuilder: PluginBuilder<State>): void;
    deactivate(): void;
}
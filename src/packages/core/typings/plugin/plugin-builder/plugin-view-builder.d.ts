import { Action, Dispatch } from "redux";
import { Epic } from "redux-observable";
import { ReDuckModuleArgs } from "../../store";
import { PluginView } from "../view";
import { PluginAppSettings } from "../app";
import { Builder } from "./builder";
export declare class PluginViewBuilder<State> implements Builder<PluginView<State>> {
    private _apps;
    private _onStart;
    private _globalEpic;
    private _modules;
    readonly _defaultAppSettings: PluginAppSettings;
    constructor();
    addApp(name: string, view: JSX.Element, settings?: Partial<PluginAppSettings>): this;
    onStart(onStart: (dispatch: Dispatch<Action>) => void): this;
    addReDuckModule(moduleArgs: ReDuckModuleArgs<State>): this;
    setGlobalEpic(epic: Epic<Action, Action, State>): this;
    build(): PluginView<State>;
}

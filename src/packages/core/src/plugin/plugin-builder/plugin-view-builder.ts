import { Action, 
         Dispatch }             from "redux";
import { Epic }                 from "redux-observable";

import { ReDuckModuleArgs,
         ReDuckModule }         from "../../store";

import { PluginView }           from "../view";
import { PluginApp, 
         PluginAppSettings }    from "../app";

import { Builder }              from "./builder";
import { BuilderFunction } from "./builder-function";


export class PluginViewBuilder<State> implements Builder<PluginView<State>> {
    private _apps: PluginApp[];
    private _onStart: (dispatch: Dispatch<Action>) => void;
    private _globalEpic: Epic<Action, Action, State>;
    private _modules: ReDuckModule<State>[];

    readonly _defaultAppSettings: PluginAppSettings;

    constructor() {
        this._apps = [];
        this._onStart = () => {};
        this._globalEpic = undefined;
        this._modules = [];

        this._defaultAppSettings = {
            icon: "question"
        };
    }

    public addApp(
        name: string, view: JSX.Element, settings?: Partial<PluginAppSettings>
    ): this {
        let inputSettings: Partial<PluginAppSettings>;
        if(!settings) {
            inputSettings = { };
        } else {
            inputSettings = settings;
        }

        const finalSettings: PluginAppSettings = Object.assign(
            {}, this._defaultAppSettings, inputSettings);

        this._apps.push({
            ...finalSettings,
            name,
            view,
        });

        return this;
    }

    public onStart(onStart: (dispatch: Dispatch<Action>) => void): this {
        this._onStart = onStart;
        return this;
    }

    public addReDuckModule(moduleArgs: ReDuckModuleArgs<State>): this {
        this._modules.push(new ReDuckModule<State>(moduleArgs));
        return this;
    }

    public setGlobalEpic(epic: Epic<Action, Action, State>): this {
        this._globalEpic = epic;
        return this;
    }

    public build(): PluginView<State> {
        return {
            apps: this._apps,
            onStart: this._onStart,
            globalEpic: this._globalEpic,
            modules: this._modules
        };
    }
}

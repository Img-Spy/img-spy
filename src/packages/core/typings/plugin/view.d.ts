import { Action, Dispatch } from "redux";
import { Epic } from "redux-observable";
import { ReDuckModule } from "../store";
import { PluginApp } from "./app";
export declare class PluginView<State> {
    apps: PluginApp[];
    modules: ReDuckModule<State>[];
    globalEpic: Epic<Action, Action, State>;
    onStart: (dispatch: Dispatch<Action>) => void;
}

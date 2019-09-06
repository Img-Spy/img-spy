import { Epic } from "redux-observable";
import { Action } from "redux-actions";
import { Module } from "./modules";
export interface WindowMetadata<State> {
    globalEpic: Epic<Action<any>, Action<any>, State>;
    modules: Array<Module<State>>;
}

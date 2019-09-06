import { ReducersMapObject, Action } from "redux";
import { Epic } from "redux-observable";
import { ReducerBuilder } from "../core";
import { StartupInfo } from "../startup";
import { Module } from "./module";
export interface ReDuckModuleArgs<State, ChildState = any> {
    name: keyof State;
    default?: ReducerBuilder<ChildState, any>;
    epic?: Epic<Action, Action, ChildState>;
}
export declare class ReDuckModule<State, ChildState = any> extends Module<State, ChildState> {
    reducer?: ReducerBuilder<ChildState, any>;
    epic?: Epic<Action, Action, ChildState>;
    constructor(reDuck: ReDuckModuleArgs<State>);
    mergeReducer(map: ReducersMapObject, info: StartupInfo): ReducersMapObject;
    mergeEpic(epics: Epic<Action, Action, ChildState>[], info: StartupInfo): Epic<Action, Action, ChildState>[];
}

import { ReducersMapObject, Action } from "redux";
import { Epic } from "redux-observable";
import { ReducerBuilder } from "../core";
import { StartupInfo } from "../startup";
import { Module } from "./module";
declare type FormReducer<S> = ReducerBuilder<S, any> | S;
export declare class FormModule<State, ChildState = any> extends Module<State, ChildState> {
    reducer: FormReducer<ChildState>;
    constructor(name: keyof State, reducer: FormReducer<ChildState>);
    mergeReducer(map: ReducersMapObject, info: StartupInfo): ReducersMapObject;
    mergeEpic(epics: Epic<Action, Action, ChildState>[], info: StartupInfo): Epic<Action, Action, ChildState>[];
}
export {};

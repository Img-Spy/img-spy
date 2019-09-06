import { Reducer, ReducersMapObject, Action } from "redux";
import { Epic } from "redux-observable";
import { StartupInfo } from "../startup";
import { Module } from "./module";
declare type ReducerGetter<T> = (info: StartupInfo) => Reducer<T>;
export declare class ReducerModule<State, ChildState = any> extends Module<State, ChildState> {
    getReducer: ReducerGetter<ChildState>;
    constructor(name: keyof State, getReducer: ReducerGetter<ChildState>);
    mergeReducer(map: ReducersMapObject, info: StartupInfo): ReducersMapObject;
    mergeEpic(epics: Epic<Action, Action, ChildState>[], info: StartupInfo): Epic<Action, Action, ChildState>[];
}
export {};

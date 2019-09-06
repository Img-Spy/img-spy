import { ReducersMapObject, Action } from "redux";
import { Epic } from "redux-observable";
import { StartupInfo } from "../startup";
import { Module } from "./module";
declare type InfoGetter<T> = (info: StartupInfo) => T;
export declare class SimpleModule<State, ChildState = any> extends Module<State, ChildState> {
    infoGetter: InfoGetter<ChildState>;
    constructor(name: keyof State, infoGetter: InfoGetter<ChildState>);
    mergeReducer(map: ReducersMapObject, info: StartupInfo): ReducersMapObject;
    mergeEpic(epics: Epic<Action, Action, ChildState>[], info: StartupInfo): Epic<Action, Action, ChildState>[];
}
export {};

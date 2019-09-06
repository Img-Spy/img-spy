import { ReducersMapObject, Action } from "redux";
import { Epic } from "redux-observable";
import { StartupInfo } from "../startup";
export declare abstract class Module<State, ChildState = any> {
    readonly name: keyof State;
    constructor(name: keyof State);
    abstract mergeReducer(map: ReducersMapObject, info: StartupInfo): ReducersMapObject;
    abstract mergeEpic(epics: Epic<Action, Action, ChildState>[], info: StartupInfo): Epic<Action, Action, ChildState>[];
}

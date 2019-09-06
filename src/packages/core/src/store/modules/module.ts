import { ReducersMapObject,
         Action }               from "redux";
import { Epic }                 from "redux-observable";

import { StartupInfo }          from "../startup";


export abstract class Module<State, ChildState = any> {
    constructor(public readonly name: keyof State) {}

    public abstract mergeReducer(map: ReducersMapObject,
        info: StartupInfo): ReducersMapObject;
    public abstract mergeEpic(epics: Epic<Action, Action, ChildState>[],
        info: StartupInfo): Epic<Action, Action, ChildState>[]
}

import { Reducer,
         ReducersMapObject,
         Action }               from "redux";
import { Epic }                 from "redux-observable";

import { StartupInfo }          from "../startup";

import { Module }               from "./module";


type ReducerGetter<T> = (info: StartupInfo) => Reducer<T>;

export class ReducerModule<State, ChildState = any>
        extends Module<State, ChildState> {

    constructor(
        name: keyof State, public getReducer: ReducerGetter<ChildState>) {
        super(name);
    }

    public mergeReducer(
        map: ReducersMapObject, info: StartupInfo
    ): ReducersMapObject {
        return Object.assign(map, {
            [this.name]: this.getReducer(info)
        });
    }

    public mergeEpic(
        epics: Epic<Action, Action, ChildState>[], info: StartupInfo
    ): Epic<Action, Action, ChildState>[] {
        return epics;
    }
}

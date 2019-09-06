import { ReducersMapObject,
         Action }               from "redux";
import { Epic }                 from "redux-observable";
import { handleActions }        from "redux-actions";

import { StartupInfo }          from "../startup";

import { Module }               from "./module";


type InfoGetter<T> = (info: StartupInfo) => T;

export class SimpleModule<State, ChildState = any>
        extends Module<State, ChildState> {

    constructor(name: keyof State, public infoGetter: InfoGetter<ChildState>) {
        super(name);
    }

    public mergeReducer(
        map: ReducersMapObject, info: StartupInfo
    ): ReducersMapObject {
        return Object.assign(map, {
            [this.name]: handleActions<ChildState, undefined>(
                {}, this.infoGetter(info)
            )
        });
    }

    public mergeEpic(
        epics: Epic<Action, Action, ChildState>[], info: StartupInfo
    ): Epic<Action, Action, ChildState>[] {
        return epics;
    }
}

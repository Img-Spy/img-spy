import { ReducersMapObject,
         Action }               from "redux";
import { Epic }                 from "redux-observable";

import { ReducerBuilder }       from "../core";
import { StartupInfo }          from "../startup";

import { Module }               from "./module";


export interface ReDuckModuleArgs<State, ChildState = any> {
    name: keyof State;
    default?: ReducerBuilder<ChildState, any>;
    epic?: Epic<Action, Action, ChildState>;
}

export class ReDuckModule<State, ChildState = any>
        extends Module<State, ChildState> {
    public reducer?: ReducerBuilder<ChildState, any>;
    public epic?: Epic<Action, Action, ChildState>;

    constructor(reDuck: ReDuckModuleArgs<State>) {
        super(reDuck.name);
        this.reducer = reDuck.default;
        this.epic = reDuck.epic;
    }

    public mergeReducer(
        map: ReducersMapObject, info: StartupInfo
    ): ReducersMapObject {
        if(!this.reducer) return map;

        return Object.assign(map, {
            [this.name]: this.reducer(info)
        });
    }

    public mergeEpic(
        epics: Epic<Action, Action, ChildState>[], info: StartupInfo
    ): Epic<Action, Action, ChildState>[] {
        if(this.epic) epics.push(this.epic);
        return epics;
    }
}

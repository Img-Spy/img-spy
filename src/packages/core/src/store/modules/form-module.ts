import { ReducersMapObject,
         Action }               from "redux";
import { Epic }                 from "redux-observable";
import { createForms }          from "react-redux-form";

import { ReducerBuilder }       from "../core";
import { StartupInfo }          from "../startup";

import { Module }               from "./module";


type FormReducer<S> = ReducerBuilder<S, any> | S;

export class FormModule<State, ChildState = any> 
        extends Module<State, ChildState> {

    constructor(name: keyof State, public reducer: FormReducer<ChildState>) {
        super(name);
    }

    public mergeReducer(
        map: ReducersMapObject, info: StartupInfo
    ): ReducersMapObject {
        let initialState = this.reducer instanceof Function ?
            this.reducer(info) : this.reducer;

        return Object.assign(map, {
            ...createForms({
                [this.name]: initialState
            })
        });
    }

    public mergeEpic(
        epics: Epic<Action, Action, ChildState>[], info: StartupInfo
    ): Epic<Action, Action, ChildState>[] {
        return epics;
    }
}

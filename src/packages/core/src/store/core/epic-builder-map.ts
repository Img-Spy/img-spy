import { Action }       from "redux";
import { Epic }         from "redux-observable";


export interface EpicBuilderMap<State> {
    [name: string]: () => Epic<Action, Action, State, any>;
}

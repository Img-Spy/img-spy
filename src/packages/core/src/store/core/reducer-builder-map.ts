import { Reducer }          from "redux";


export interface ReducerBuilderMap<State> {
    [name: string]: () => {
        [name: string]: Reducer<State>;
    };
}

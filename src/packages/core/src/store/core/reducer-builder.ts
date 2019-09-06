import { handleActions,
         ReducerMap,
         Reducer }          from "redux-actions";

import { StartupInfo }      from "../startup";


type ReducerMapBuilder<State, Payload, Settings> = 
    (info: StartupInfo<Settings>) => ReducerMap<State, Payload>;
type StateBuilder<State, Settings> = (info: StartupInfo<Settings>) => State;

export type ReducerBuilder<State, Payload, Settings = any> =
    (info: StartupInfo<Settings>) => Reducer<State, Payload>;

export default function reducerBuilder<State, Payload, Settings = any>(
    reducerMap: ReducerMap<State, Payload> | ReducerMapBuilder<State, Payload, Settings>,
    initialState: State | StateBuilder<State, Settings>
): ReducerBuilder<State, Payload, Settings> {
    return (info: StartupInfo<Settings>) => handleActions(
        reducerMap instanceof Function ? reducerMap(info) : reducerMap,
        initialState instanceof Function ? initialState(info) : initialState
    );
};

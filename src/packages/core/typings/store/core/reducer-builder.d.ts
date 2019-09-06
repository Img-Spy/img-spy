import { ReducerMap, Reducer } from "redux-actions";
import { StartupInfo } from "../startup";
declare type ReducerMapBuilder<State, Payload, Settings> = (info: StartupInfo<Settings>) => ReducerMap<State, Payload>;
declare type StateBuilder<State, Settings> = (info: StartupInfo<Settings>) => State;
export declare type ReducerBuilder<State, Payload, Settings = any> = (info: StartupInfo<Settings>) => Reducer<State, Payload>;
export default function reducerBuilder<State, Payload, Settings = any>(reducerMap: ReducerMap<State, Payload> | ReducerMapBuilder<State, Payload, Settings>, initialState: State | StateBuilder<State, Settings>): ReducerBuilder<State, Payload, Settings>;
export {};

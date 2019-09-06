import { Epic }             from "redux-observable";
import { Action }           from "redux-actions";

import { Module }           from "./modules";


export interface WindowMetadata<State> {
    // info: StartupInfo;
    globalEpic: Epic<Action<any>, Action<any>, State>;
    modules: Array<Module<State>>;
}

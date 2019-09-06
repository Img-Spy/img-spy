import { Action }                   from "redux-actions";
import { combineEpics }             from "redux-observable";

import State                        from "./state";
import { fstWatcherEpic,
         settingsEpic }             from "store/epics";


export default combineEpics<Action<any>, Action<any>, State>(
    // TODO: Add fstWatcherEpic
    // fstWatcherEpic,
    settingsEpic,
);

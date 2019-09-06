import { Action }                   from "redux-actions";
import { combineEpics }             from "redux-observable";

import { fstWatcherEpic,
         settingsEpic }             from "store/epics";

import State                        from "../state";
import autoSaveSettingsEpic         from "./auto-save-settings";
import exportEpic                   from "./export-epic";


export default combineEpics<Action<any>, Action<any>, State>(
    fstWatcherEpic,
    settingsEpic,
    autoSaveSettingsEpic,
    // exportEpic
);

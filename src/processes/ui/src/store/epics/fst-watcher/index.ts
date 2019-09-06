import { combineEpics }             from "redux-observable";

import State                        from "./state";
import virtualMountEpic             from "./virtual-mount";
import removeFileEpic               from "./remove-file";
import exportFileEpic               from "./export-file";
import copySourceIntoSettingsEpic   from "./copy-source-into-settings";
import openOutFileEpic              from "./open-out-file";


export default combineEpics<any, any, State>(
    copySourceIntoSettingsEpic,
    exportFileEpic,
    virtualMountEpic,
    removeFileEpic,
    openOutFileEpic,
);

import { combineEpics }             from "redux-observable";

import State                        from "./state";
import saveSettingsOnDisk           from "./save-settings-on-disk";
import deleteSource                 from "./delete-source";
import updateSource                 from "./update-source";


export default combineEpics<any, any, State>(
    saveSettingsOnDisk,
    deleteSource,
    updateSource
);

import { combineEpics }             from "redux-observable";

import modalEpic                    from "./modal.epic";
import settingsEpic                 from "./settings.epic";
import fstWatcherEpic               from "./fst-watcher.epic";
import autoSaveSettingsEpic         from "./auto-save-settings.epic";
import caseWindowEpic               from "./case-window.epic";

const epicMap = {
    "case-selector": () => {
        return null;
    },
    "case": () => {
        return (combineEpics as any)(
            modalEpic(),
            fstWatcherEpic(),
            settingsEpic(),
            autoSaveSettingsEpic(),
            caseWindowEpic()
        );
    },
    "settings": () => {
        return (combineEpics as any)(
            settingsEpic(),
            modalEpic(),
        );
    }
};

const epicBuilder = (name) => {
    const epic = epicMap[name];
    if (!epic) {
        throw new Error("Epic not found.");
    }

    return epic();
};

export default epicBuilder;

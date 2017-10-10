import { combineEpics }             from "redux-observable";

import modalEpic                    from "./modal.epic";
import settingsEpic                 from "./settings.epic";
import fstWatcherEpic               from "./fst-watcher.epic";
import autoSaveSettingsEpic         from "./auto-save-settings.epic";
import explorerEpic                 from "./explorer.epic";
import timelineEpic                 from "./timeline.epic";
import searchEpic                   from "./search.epic";

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
            explorerEpic(),
            timelineEpic(),
            searchEpic()
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

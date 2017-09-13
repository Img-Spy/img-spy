import { combineReducers }      from "redux";
import { createForms }          from "react-redux-form";

import { api }                  from "app/api";
import args                     from "app/args";

import navigateReducer          from "./navigate.reducer";
import resizeReducer            from "./resize.reducer";
import settingsReducer          from "./settings.reducer";
import settingsWindowReducer    from "./settings-window.reducer";
import terminalReducer          from "./terminal.reducer";
import fstWatcherReducer        from "./fst-watcher.reducer";
import caseWindowReducer        from "./case-window.reducer";


const reducersMap = {
    "case-selector": () =>  ({ navigate: navigateReducer() }),
    "case": () => {
        const initialSettings = api.loadSettingsSync();
        const folder = args["folder"];
        return {
            navigate: navigateReducer(),
            resize: resizeReducer(),
            terminal: terminalReducer(),
            settings: settingsReducer(initialSettings),
            fstRoot: fstWatcherReducer(folder, initialSettings),
            caseWindow: caseWindowReducer(),

            /// Forms
            ...createForms({
                fstItem: {}
            })
        };
    },
    "settings": () => {
        const initialSettings = api.loadSettingsSync();
        return {
            navigate: navigateReducer(),
            resize: resizeReducer(),
            settingsWindow: settingsWindowReducer(),

            /// Forms
            ...createForms({
                settings: settingsReducer(initialSettings),
                dataSource: {}
            })
        };
    }
};

const reducerBuilder = (name) => {
    const reducer = reducersMap[name];
    if (!reducer) {
        throw new Error("Reducer not found.");
    }

    return combineReducers(reducer());
};

export default reducerBuilder;

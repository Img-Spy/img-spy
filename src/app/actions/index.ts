import { Action }               from "redux-actions";
import { actions }              from "app/constants";
import { NavigatePayload }      from "app/models";

export { ApplySettingsPayload,
         applySettings,
         deleteSource,
         updateSource,
         updateTheme,
         updateSettings }       from "./settings.actions";
export { selectSource,
         editSource }           from "./settings-window.actions";
export { pushTerminalLine }     from "./terminal.actions";
export { fstAdd,
         fstOpen,
         fstToggleOpen,
         fstAnalyze,
         fstUnlink,
         fstList,
         fstContent,
         fstExport }            from "./fst-watcher.actions";
export { selectFile,
         openDockPanel,
         closeDockPanel,
         updateDockPanel,
         activateFile }         from "./explorer.actions";
export { updateResizeSize,
         moveResize,
         startResize,
         stopResize }           from "./resize.actions";
export { createTimeline,
         updateTimeline,
         selectTimeline,
         deleteTimeline,
         updateTableSettings }  from "./timeline.actions";


interface NavigatorAction<T> {
    (path: string, args?: T): Action<NavigatePayload<T>>;
}

export interface Navigator<T> {
    (path: string, args?: T): void;
}

export function createNavigator<T>(name: string): NavigatorAction<T> {
    const type = actions.NAVIGATE;
    const navigator: NavigatorAction<T> = (path, args) => {
        const payload = { name, path, args };
        return { type, payload };
    };

    return navigator;
}

export const closeModal = () => ({ type: actions.CLOSE_MODAL });

export const doNothing = () => ({ type: "DO_NOTHING" });

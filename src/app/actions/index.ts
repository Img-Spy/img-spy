import { Action }           from "redux-actions";
import { actions }          from "app/constants";
import { NavigatePayload }  from "app/models";

export { ApplySettingsPayload,
         applySettings,
         deleteSource,
         updateSource,
         updateSettings }   from "./settings.actions";
export { selectSource,
         editSource }       from "./settings-window.actions";
export { pushTerminalLine } from "./terminal.actions";
export { fstAdd,
         fstOpen,
         fstToggleOpen,
         fstHash,
         fstUnlink }        from "./fst-watcher.actions";
export { selectFile,
         openDockPanel,
         closeDockPanel,
         updateDockPanel,
         activateFile }     from "./case-window.actions";
export { updateResizeSize,
         moveResize,
         startResize,
         stopResize }       from "./resize.actions";


export const ping = () => ({ type: actions.PING });

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

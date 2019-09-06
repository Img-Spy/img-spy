import { Action }               from "redux-actions";
import { FileSelector }         from "img-spy-modules/fst-watcher";

import { DockPanelModel }       from "./explorer.models";
import types                    from "./explorer.types";


const selectFile = (
    selector?: FileSelector
): Action<FileSelector> => ({
    type: types.SELECT_FILE,
    payload: selector === undefined ? undefined : {
        path: selector.path,
        address: selector.address
    }
});

const activateFile = (
    item?: FileSelector
): Action<FileSelector> => ({
    type: types.ACTIVATE_FILE,
    payload: item === undefined ? undefined : {
        path: item.path,
        address: item.address
    }
});

const openDockPanel = (
    payload: DockPanelModel
): Action<DockPanelModel> => ({
    type: types.OPEN_PANEL,
    payload
});

const closeDockPanel = (
    payload: string
): Action<string> => ({
    type: types.CLOSE_PANEL,
    payload
});

const updateDockPanel = (
    payload: DockPanelModel
): Action<DockPanelModel> => ({
    type: types.UPDATE_PANEL,
    payload
});

export default {
    selectFile,
    activateFile,

    openDockPanel,
    closeDockPanel,
    updateDockPanel,
};

import { Action }               from "redux-actions";

import { DockPanelModel,
         FileSelector }         from "app/models";
import { actions }              from "app/constants";

export const selectFile = (selector?: FileSelector): Action<FileSelector> =>
    ({
        type: actions.CASE_SELECT_FILE,
        payload: selector === undefined ? undefined : {
            path: selector.path,
            address: selector.address
        }
    });

export const activateFile = (item?: FileSelector): Action<FileSelector> =>
    ({
        type: actions.CASE_ACTIVATE_FILE,
        payload: item === undefined ? undefined : {
            path: item.path,
            address: item.address
        }
    });

export const openDockPanel = (payload: DockPanelModel): Action<DockPanelModel> =>
    ({ type: actions.CASE_OPEN_PANEL, payload });

export const closeDockPanel = (payload: string): Action<string> =>
    ({ type: actions.CASE_CLOSE_PANEL, payload });

export const updateDockPanel = (payload: DockPanelModel): Action<DockPanelModel> =>
    ({ type: actions.CASE_UPDATE_PANEL, payload });

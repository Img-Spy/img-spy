import { Action }               from "redux-actions";

import { DockPanelModel }       from "app/models";
import { actions }              from "app/constants";

export const selectFile = (payload: string): Action<string> =>
    ({ type: actions.CASE_SELECT_FILE, payload });

export const activateFile = (payload: string): Action<string> =>
    ({ type: actions.CASE_ACTIVATE_FILE, payload });

export const openDockPanel = (payload: DockPanelModel): Action<DockPanelModel> =>
    ({ type: actions.CASE_OPEN_PANEL, payload });

export const closeDockPanel = (payload: string): Action<string> =>
    ({ type: actions.CASE_CLOSE_PANEL, payload });

export const updateDockPanel = (payload: DockPanelModel): Action<DockPanelModel> =>
    ({ type: actions.CASE_UPDATE_PANEL, payload });

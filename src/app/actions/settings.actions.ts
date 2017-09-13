
import { Action }               from "redux-actions";

import { actions }              from "app/constants";
import { SettingsModel,
         Theme,
         DataSource }           from "app/models";


export interface ApplySettingsPayload {
    close: boolean;
}

export const applySettings = (payload: ApplySettingsPayload): Action<ApplySettingsPayload> =>
    ({ type: actions.APPLY_SETTINGS, payload });

export const updateSettings = (payload: SettingsModel): Action<SettingsModel> =>
    ({ type: actions.UPDATE_SETTINGS, payload });

export const updateSource = (payload: DataSource): Action<DataSource> =>
    ({ type: actions.UPDATE_SOURCE, payload });

export const deleteSource = (path: string): Action<string> =>
    ({ type: actions.DELETE_SOURCE, payload: path });

export const updateTheme = (theme: Theme): Action<Theme> =>
    ({ type: actions.UPDATE_THEME, payload: theme });

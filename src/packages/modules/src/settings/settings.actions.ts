import { Action }               from "redux-actions";

import { SettingsModel,
         Theme,
         ApplySettingsPayload,
         DataSource }           from "./settings.models";
import types                    from "./settings.types";


const applySettings = (
    payload: ApplySettingsPayload
): Action<ApplySettingsPayload> => ({
    type: types.APPLY,
    payload
});

const updateSettings = <T = any>(
    payload: SettingsModel<T>
): Action<SettingsModel<T>> => ({
    type: types.UPDATE,
    payload
});

const updateSource = (
    payload: DataSource
): Action<DataSource> => ({
    type: types.UPDATE_SOURCE,
    payload
});

const deleteSource = (
    path: string
): Action<string> => ({
    type: types.DELETE_SOURCE,
    payload: path
});

const updateTheme = (
    theme: Theme
): Action<Theme> => ({
    type: types.UPDATE_THEME,
    payload: theme
});


export default {
    applySettings,
    updateSettings,
    updateSource,
    deleteSource,
    updateTheme
};

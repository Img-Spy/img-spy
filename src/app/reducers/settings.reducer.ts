import { handleActions,
         Action }           from "redux-actions";
import * as deepcopy        from "deepcopy";

import { SettingsModel,
         Theme,
         DataSource }       from "app/models";
import { actions }          from "app/constants";


export default (initialSettings: SettingsModel) =>
    handleActions<SettingsModel, SettingsModel | DataSource | string | Theme>({
            [actions.UPDATE_SETTINGS]: (state: SettingsModel,
                                        action: Action<SettingsModel>): SettingsModel => {
                return deepcopy(action.payload);
            },

            [actions.UPDATE_THEME]: (state: SettingsModel,
                                     action: Action<Theme>): SettingsModel => {
                const { payload: theme } = action;
                return { ...state, theme };
            },

            [actions.DELETE_SOURCE]: (state: SettingsModel,
                                      action: Action<string>): SettingsModel => {
                const path = action.payload,
                      { [path]: deleted, ...sources } = state.sources;

                return { ...state, sources };
            },

            [actions.UPDATE_SOURCE]: (state: SettingsModel,
                                      action: Action<DataSource>): SettingsModel => {
                const source = action.payload;
                return {
                    ...state,
                    sources: {
                        ...state.sources,
                        [source.path]: source
                    }
                };
            }

        }, initialSettings);

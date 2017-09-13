import { handleActions,
         Action }               from "redux-actions";
import * as deepcopy            from "deepcopy";

import { SettingsWindowModel,
         DataSource }           from "app/models";
import { actions }              from "app/constants";


export default () => {
    const initialState: SettingsWindowModel = {
        sources: { }
    };
    return handleActions<SettingsWindowModel, DataSource>({
            [actions.SETTINGS_SELECT_SOURCE]:
                (state: SettingsWindowModel, action: Action<DataSource>): SettingsWindowModel => {
                    return Object.assign({}, state, {
                        sources: {
                            selectedSource: action.payload
                        }
                    } as SettingsWindowModel);
                },
        }, initialState);
    };

import { Action }               from "redux-actions";

import { actions }              from "app/constants";
import { DataSource }           from "app/models";


export const selectSource = (payload: DataSource) =>
    ({ type: actions.SETTINGS_SELECT_SOURCE, payload } as Action<DataSource>);

export const editSource = (payload: DataSource) =>
    ({ type: actions.UPDATE_SOURCE, payload } as Action<DataSource>);

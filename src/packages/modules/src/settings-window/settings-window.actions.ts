import { Action }               from "redux-actions";

import { DataSource }           from "./settings-window.models";
import types                    from "./settings-window.types";


export const selectSource = (
    payload: DataSource
): Action<DataSource> => ({
    type: types.SELECT_SOURCE,
    payload
});


export default {
    selectSource
};

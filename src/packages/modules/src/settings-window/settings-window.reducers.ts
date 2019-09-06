import produce                  from "immer";

import { Reducer }              from "redux-actions";
import { reducerBuilder }       from "img-spy-core";

import { SettingsWindowModel,
         DataSource }           from "./settings-window.models";
import types                    from "./settings-window.types";


const selectSource: Reducer<SettingsWindowModel, DataSource> = (
    state, action
) => produce(state, draft => {
    draft.sources.selectedSource = action.payload;
});

type Payload = DataSource;
export default reducerBuilder<SettingsWindowModel, Payload>({
    [types.SELECT_SOURCE]: selectSource,
}, { sources: {} });

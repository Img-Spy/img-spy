import produce              from "immer";
import { Reducer }          from "redux-actions";
import { reducerBuilder }   from "img-spy-core";

import { SettingsModel,
         Theme,
         DataSource }       from "./settings.models";
import types                from "./settings.types";


const update: Reducer<SettingsModel, SettingsModel> = (
    state, action
) => produce(state, draft => {
    Object.assign(draft, action.payload)
});

const updateTheme: Reducer<SettingsModel, Theme> = (
    state, action
) => produce(state, draft => {
    draft.theme = action.payload;
});

const deleteSource: Reducer<SettingsModel, string> = (
    state, action
) => produce(state, draft => {
    delete draft[action.payload];
});

const updateSource: Reducer<SettingsModel, DataSource> = (
    state, action
) => produce(state, draft => {
    const source = action.payload;
    draft.sources[source.path] = source;
});


type Payload = SettingsModel | DataSource | string | Theme;
export default reducerBuilder<SettingsModel, Payload>({
    [types.UPDATE]: update,
    [types.UPDATE_THEME]: updateTheme,
    [types.DELETE_SOURCE]: deleteSource,
    [types.UPDATE_SOURCE]: updateSource

}, (info) => info.initialSettings);

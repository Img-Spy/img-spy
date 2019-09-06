import { reducerBuilder } from 'img-spy-core';
import produce from 'immer';

var settings_selectors = {};
//# sourceMappingURL=settings.selectors.js.map

const APPLY = "imgspy/settings/APPLY";
const UPDATE = "imgspy/settings/UPDATE";
const UPDATE_THEME = "imgspy/settings/UPDATE_THEME";
const UPDATE_SOURCE = "imgspy/settings/UPDATE_SOURCE";
const DELETE_SOURCE = "imgspy/settings/DELETE_SOURCE";
var types = {
    APPLY,
    UPDATE,
    UPDATE_THEME,
    UPDATE_SOURCE,
    DELETE_SOURCE
};
//# sourceMappingURL=settings.types.js.map

const applySettings = (payload) => ({
    type: types.APPLY,
    payload
});
const updateSettings = (payload) => ({
    type: types.UPDATE,
    payload
});
const updateSource = (payload) => ({
    type: types.UPDATE_SOURCE,
    payload
});
const deleteSource = (path) => ({
    type: types.DELETE_SOURCE,
    payload: path
});
const updateTheme = (theme) => ({
    type: types.UPDATE_THEME,
    payload: theme
});
var settings_actions = {
    applySettings,
    updateSettings,
    updateSource,
    deleteSource,
    updateTheme
};
//# sourceMappingURL=settings.actions.js.map

var settings_utils = {};
//# sourceMappingURL=settings.utils.js.map

const update = (state, action) => produce(state, draft => {
    Object.assign(draft, action.payload);
});
const updateTheme$1 = (state, action) => produce(state, draft => {
    draft.theme = action.payload;
});
const deleteSource$1 = (state, action) => produce(state, draft => {
    delete draft[action.payload];
});
const updateSource$1 = (state, action) => produce(state, draft => {
    const source = action.payload;
    draft.sources[source.path] = source;
});
var settings_reducers = reducerBuilder({
    [types.UPDATE]: update,
    [types.UPDATE_THEME]: updateTheme$1,
    [types.DELETE_SOURCE]: deleteSource$1,
    [types.UPDATE_SOURCE]: updateSource$1
}, (info) => info.initialSettings);
//# sourceMappingURL=settings.reducers.js.map

const name = "settings";
//# sourceMappingURL=index.js.map

export default settings_reducers;
export { name, settings_actions as settingsActions, settings_selectors as settingsSelectors, types as settingsTypes, settings_utils as settingsUtils };
//# sourceMappingURL=index.js.map

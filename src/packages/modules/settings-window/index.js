import { reducerBuilder } from 'img-spy-core';
import produce from 'immer';

var settingsWindow_selectors = {};
//# sourceMappingURL=settings-window.selectors.js.map

const SELECT_SOURCE = "imgspy/settings-window/SELECT_SOURCE";
var types = {
    SELECT_SOURCE
};
//# sourceMappingURL=settings-window.types.js.map

const selectSource = (payload) => ({
    type: types.SELECT_SOURCE,
    payload
});
var settingsWindow_actions = {
    selectSource
};
//# sourceMappingURL=settings-window.actions.js.map

var settingsWindow_utils = {};
//# sourceMappingURL=settings-window.utils.js.map

const selectSource$1 = (state, action) => produce(state, draft => {
    draft.sources.selectedSource = action.payload;
});
var settingsWindow_reducers = reducerBuilder({
    [types.SELECT_SOURCE]: selectSource$1,
}, { sources: {} });
//# sourceMappingURL=settings-window.reducers.js.map

const name = "settingsWindow";
//# sourceMappingURL=index.js.map

export default settingsWindow_reducers;
export { name, settingsWindow_actions as settingsWindowActions, settingsWindow_selectors as settingsWindowSelectors, types as settingsWindowTypes, settingsWindow_utils as settingsWindowUtils };
//# sourceMappingURL=index.js.map

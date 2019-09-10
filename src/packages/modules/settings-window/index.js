import { reducerBuilder } from 'img-spy-core';
import produce from 'immer';

var settingsWindow_selectors = {};

const SELECT_SOURCE = "imgspy/settings-window/SELECT_SOURCE";
var types = {
    SELECT_SOURCE
};

const selectSource = (payload) => ({
    type: types.SELECT_SOURCE,
    payload
});
var settingsWindow_actions = {
    selectSource
};

var settingsWindow_utils = {};

const selectSource$1 = (state, action) => produce(state, draft => {
    draft.sources.selectedSource = action.payload;
});
var settingsWindow_reducers = reducerBuilder({
    [types.SELECT_SOURCE]: selectSource$1,
}, { sources: {} });

const name = "settingsWindow";

export default settingsWindow_reducers;
export { name, settingsWindow_actions as settingsWindowActions, settingsWindow_selectors as settingsWindowSelectors, types as settingsWindowTypes, settingsWindow_utils as settingsWindowUtils };
//# sourceMappingURL=index.js.map

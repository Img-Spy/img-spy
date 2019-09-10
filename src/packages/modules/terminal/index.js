import { reducerBuilder } from 'img-spy-core';
import produce from 'immer';

var terminal_selectors = {};

const PUSH_LINE = "imgspy/terminal/PUSH_LINE";
var types = {
    PUSH_LINE
};

const pushLine = (payload) => ({
    type: types.PUSH_LINE,
    payload
});
var terminal_actions = {
    pushLine
};

var terminal_utils = {};

const pushLine$1 = (state, action) => produce(state, draft => {
    draft.lines.push(action.payload);
});
var terminal_reducers = reducerBuilder({
    [types.PUSH_LINE]: pushLine$1
}, {
    lines: []
});

const name = "terminal";

export default terminal_reducers;
export { name, terminal_actions as terminalActions, terminal_selectors as terminalSelectors, types as terminalTypes, terminal_utils as terminalUtils };
//# sourceMappingURL=index.js.map

import { reducerBuilder } from 'img-spy-core';
import produce from 'immer';

var terminal_selectors = {};
//# sourceMappingURL=terminal.selectors.js.map

const PUSH_LINE = "imgspy/terminal/PUSH_LINE";
var types = {
    PUSH_LINE
};
//# sourceMappingURL=terminal.types.js.map

const pushLine = (payload) => ({
    type: types.PUSH_LINE,
    payload
});
var terminal_actions = {
    pushLine
};
//# sourceMappingURL=terminal.actions.js.map

var terminal_utils = {};
//# sourceMappingURL=terminal.utils.js.map

const pushLine$1 = (state, action) => produce(state, draft => {
    draft.lines.push(action.payload);
});
var terminal_reducers = reducerBuilder({
    [types.PUSH_LINE]: pushLine$1
}, {
    lines: []
});
//# sourceMappingURL=terminal.reducers.js.map

const name = "terminal";
//# sourceMappingURL=index.js.map

export default terminal_reducers;
export { name, terminal_actions as terminalActions, terminal_selectors as terminalSelectors, types as terminalTypes, terminal_utils as terminalUtils };
//# sourceMappingURL=index.js.map

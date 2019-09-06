import produce                  from "immer";

import { Reducer }              from "redux-actions";
import { reducerBuilder }       from "img-spy-core";

import { TerminalModel,
         TerminalLine }         from "./terminal.models";
import types                    from "./terminal.types";


const pushLine: Reducer<TerminalModel, TerminalLine> = (
    state, action
) => produce(state, draft => {
    draft.lines.push(action.payload);
});


type Payload = TerminalLine;
export default reducerBuilder<TerminalModel, Payload>({
    [types.PUSH_LINE]: pushLine
}, {
    lines: []
});

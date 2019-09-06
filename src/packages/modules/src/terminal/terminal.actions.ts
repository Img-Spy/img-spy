import { Action }               from "redux-actions";

import { TerminalLine }         from "./terminal.models";
import types                    from "./terminal.types";


const pushLine = (
    payload: TerminalLine
): Action<TerminalLine> => ({
    type: types.PUSH_LINE,
    payload
});


export default {
    pushLine
};

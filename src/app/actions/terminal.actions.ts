import { Action }           from "redux-actions";

import { TerminalLine }     from "app/models";
import { actions }          from "app/constants";


export const pushTerminalLine = (payload: TerminalLine) =>
    ({ type: actions.PUSH_TERMINAL_LINE, payload } as Action<TerminalLine>);

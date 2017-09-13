import { handleActions,
         Action }               from "redux-actions";
import * as deepcopy            from "deepcopy";

import { TerminalModel,
         TerminalLine }         from "app/models";
import { actions }              from "app/constants";


export default () => {
    const initialState: TerminalModel = {
        lines: []
    };
    return handleActions<TerminalModel, TerminalLine>({
            [actions.PUSH_TERMINAL_LINE]:
                (state: TerminalModel, action: Action<TerminalLine>): TerminalModel => {
                    return {
                        ...state,
                        lines: [
                            ...state.lines,
                            { ...action.payload }
                        ]
                    };
                },
        }, initialState);
};

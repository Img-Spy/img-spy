import { combineEpics }         from "redux-observable";
import { Action }               from "redux-actions";

import { WindowsModelState }    from "../windows.models";
import closeModal               from "./close-modal";


export default combineEpics<Action<any>, Action<any>, WindowsModelState>(
    closeModal,
);

import { Action }               from "redux-actions";

import types                    from "./windows.types";


const closeModal = (
): Action<undefined> => ({
    type: types.CLOSE_MODAL,
    payload: undefined
});

export default {
    closeModal
};

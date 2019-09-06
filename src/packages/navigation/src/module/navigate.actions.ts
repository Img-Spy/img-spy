import { Action }               from "redux-actions";

import { NavigatePayload }      from "./navigate.models";
import types                    from "./navigate.types";


const navigate = (
    name: string, path: string, args: any = undefined
): Action<NavigatePayload> => ({
    type: types.NAVIGATE,
    payload: { name, path, args }
});


export default {
    navigate
};

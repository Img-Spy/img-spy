import { Action }               from "redux-actions";

import { ResizeSize,
         ResizeModel,
         ResizePayload,
         StartResizePayload,
         UpdateResizePayload }  from "./resize.models";
import types                    from "./resize.types";


const initialize = (
    payload: ResizeModel
): Action<ResizeModel> => ({
    type: types.INITIALIZE,
    payload
});

const updateSize = (
    name: string, size: ResizeSize
): Action<UpdateResizePayload> => ({
    type: types.UPDATE,
    payload: {
        name,
        size
    }
});

const start = (
    name: string, index: number
): Action<StartResizePayload> => ({
    type: types.START,
    payload: {
        name,
        index
    }
});

const move = (
    name: string, mouse: MouseEvent
): Action<ResizePayload> => ({
    type: types.MOVE,
    payload: {
        name,
        mouse
    }
});

const stop = (
    name: string, mouse: MouseEvent
): Action<ResizePayload> => ({
    type: types.STOP,
    payload: {
        name,
        mouse
    }
});


export default {
    initialize,
    updateSize,
    start,
    move,
    stop
};

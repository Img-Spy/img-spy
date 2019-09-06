import deepCopy                 from "deepcopy";

import { Reducer }              from "redux-actions";
import { reducerBuilder }       from "img-spy-core";

import { ResizeModel,
         UpdateResizePayload,
         StartResizePayload,
         ResizePayload,
         ResizeModelMap }       from "./resize.models";
import utils                    from "./resize.utils";
import types                    from "./resize.types";


const initialize: Reducer<ResizeModelMap, ResizeModel> = (
    state, action
) => {
    const { name } = action.payload

    return {
        ...state,
        [name]: {
            ...deepCopy(action.payload)
        }
    }
};

const update: Reducer<ResizeModelMap, UpdateResizePayload> = (
    state, action
) => {
    const { name, ...props } = action.payload;

    return {
        ...state,
        [name]: {
            ...state[name],
            ...deepCopy(props)
        }
    };
}

const start: Reducer<ResizeModelMap, StartResizePayload> = (
    state, action
) => {
    const { name, index } = action.payload;

    return {
        ...state,
        [name]: {
            ...state[name],
            rszIndex: index
        }
    };
};

const move: Reducer<ResizeModelMap, ResizePayload> = (
    state, action
) => {
    const { name, mouse } = action.payload;
    const { [name]: resize } = state;
    const items = utils.doResize(mouse, resize);

    return {
        ...state,
        [name]: {
            ...resize,
            items
        }
    };
};

const stop: Reducer<ResizeModelMap, ResizePayload> = (
    state, action
) => {
    const { name, mouse } = action.payload;
    const { [name]: resize } = state;
    const { rszIndex, ...props } = resize;
    const items = utils.doResize(mouse, resize);

    return {
        ...state,
        [name]: {
            ...props,
            items
        }
    };
};


type Payload = UpdateResizePayload | StartResizePayload |
               ResizePayload | ResizeModel;
export default reducerBuilder<ResizeModelMap, Payload>({
    [types.INITIALIZE]: initialize,
    [types.UPDATE]: update,
    [types.START]: start,
    [types.MOVE]: move,
    [types.STOP]: stop,
}, {});

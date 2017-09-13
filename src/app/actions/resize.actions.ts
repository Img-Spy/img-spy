import { Action }               from "redux-actions";

import { actions }              from "app/constants";
import { ResizeSize,
         ResizePayload,
         StartResizePayload,
         UpdateResizePayload }  from "app/models";


export const updateResizeSize = (name: string, size: ResizeSize): Action<UpdateResizePayload> =>
    ({ type: actions.RSZ_UPDATE, payload: { name, size } });

export const startResize = (name: string, index: number): Action<StartResizePayload> =>
    ({ type: actions.RSZ_START, payload: { name, index } });

export const moveResize = (name: string, mouse: MouseEvent): Action<ResizePayload> =>
    ({ type: actions.RSZ_MOVE, payload: { name, mouse  } });

export const stopResize = (name: string, mouse: MouseEvent): Action<ResizePayload> =>
    ({ type: actions.RSZ_STOP, payload: { name, mouse } });

import { Action } from "redux-actions";
import { ResizeSize, ResizeModel, ResizePayload, StartResizePayload, UpdateResizePayload } from "./resize.models";
declare const _default: {
    initialize: (payload: ResizeModel) => Action<ResizeModel>;
    updateSize: (name: string, size: ResizeSize) => Action<UpdateResizePayload>;
    start: (name: string, index: number) => Action<StartResizePayload>;
    move: (name: string, mouse: MouseEvent) => Action<ResizePayload>;
    stop: (name: string, mouse: MouseEvent) => Action<ResizePayload>;
};
export default _default;

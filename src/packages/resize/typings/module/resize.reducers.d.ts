import { ResizeModel, UpdateResizePayload, StartResizePayload, ResizePayload, ResizeModelMap } from "./resize.models";
declare type Payload = UpdateResizePayload | StartResizePayload | ResizePayload | ResizeModel;
declare const _default: import("img-spy-core").ReducerBuilder<ResizeModelMap, Payload, any>;
export default _default;

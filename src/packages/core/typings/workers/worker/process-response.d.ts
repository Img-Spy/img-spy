import { QueueResponse } from "../queue";
export declare type ProcessResponse<T> = (message: QueueResponse<T>, handler: any) => void;

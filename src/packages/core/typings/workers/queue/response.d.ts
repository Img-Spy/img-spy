import { ApiResponse } from "../../ipc";
export interface QueueResponse<R = any> extends ApiResponse<R> {
    worker?: number;
    queue?: string;
}

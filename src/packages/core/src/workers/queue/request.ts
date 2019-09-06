import { ApiRequest } from "../../ipc";


export interface QueueRequest<T> extends ApiRequest<T> {
    worker?: number;
    queue?: string;
}

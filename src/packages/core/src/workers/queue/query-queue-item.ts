import { QueueResponse } from "./response";
import { QueueRequest } from "./request";


export interface QueryQueueItem<T, F> {
    request: QueueRequest<T>;
    response?: QueueResponse<T>;
    cb: F;
}

import { QueueResponse }    from "../queue";


export type ProcessResponse<T> =
    (message: QueueResponse<T>, handler: any) => void;

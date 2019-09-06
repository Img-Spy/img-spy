import { QueueResponse } from "../queue";
export declare class ChildProcessHelper<R> {
    protected _send: (message: QueueResponse<R>, sendHandle?: any) => void;
    protected id: string;
    protected type: string;
    protected worker: number;
    protected queue: string;
    constructor(_send: (message: QueueResponse<R>, sendHandle?: any) => void, id: string, type: string, worker: number, queue: string);
    send(response?: R): void;
    finish(): void;
    error(code: number): void;
}

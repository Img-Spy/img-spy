/// <reference types="node" />
import { ChildProcess } from "child_process";
import { QueueRequest } from "../queue";
import { ProcessResponse } from "./process-response";
export declare class Worker<T> {
    private id;
    protected childProcess: ChildProcess;
    private busy;
    constructor(id: number, childProcessFile: string, onResponse: ProcessResponse<T>);
    send(message: QueueRequest<T>): void;
    kill(): void;
    readonly killed: boolean;
    readonly isBusy: boolean;
}

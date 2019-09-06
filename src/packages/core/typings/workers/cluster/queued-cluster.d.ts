import { QueryObservable, QueueRequest, QueueResponse } from "../queue";
import { Cluster } from "./cluster";
export declare abstract class QueuedCluster<T, F extends Function> extends Cluster<T> {
    private queues;
    private neededWorkers;
    private message$;
    constructor(childProcessRelPath: string);
    start(): void;
    protected createQueue(name: string, maxQueries?: number): void;
    queueMessage(request: QueueRequest<T>, cb: F, queueName?: string): void;
    protected onResponse(response: QueueResponse<T>, sendHandle: any): void;
    protected abstract handleMessages(message$: QueryObservable<T, F>): any;
    protected createQueues(): void;
}

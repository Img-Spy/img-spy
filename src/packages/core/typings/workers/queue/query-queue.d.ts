import { Notifiable } from "./notifiable";
import { QueryQueueItem } from "./query-queue-item";
export declare class QueryQueue<T, F> {
    private cluster;
    private _maxQueries;
    private queryQueue;
    private servingQueries;
    constructor(cluster: Notifiable<T>, _maxQueries: any);
    queueMessage(queueItem: QueryQueueItem<T, F>): void;
    nextQueueItem(): void;
    readonly servingQueriesCount: number;
    pop(id: string): QueryQueueItem<T, F>;
    get(id: string): QueryQueueItem<T, F>;
    readonly maxQueries: number;
}

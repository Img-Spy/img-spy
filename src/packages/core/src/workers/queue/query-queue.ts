import { Notifiable }           from "./notifiable";
import { QueryQueueItem }       from "./query-queue-item";


export class QueryQueue<T, F> {
    private queryQueue: QueryQueueItem<T, F>[];
    private servingQueries: { [id: string]: QueryQueueItem<T, F> };

    constructor(private cluster: Notifiable<T>, private _maxQueries) {
        this.queryQueue = [];
        this.servingQueries = {};
    }

    public queueMessage(queueItem: QueryQueueItem<T, F>) {
        this.queryQueue.push(queueItem);
        this.nextQueueItem();
    }

    public nextQueueItem() {
        if (this.servingQueriesCount >= this._maxQueries) { return; }

        const currentItem = this.queryQueue.shift();
        if (!currentItem) { return; }

        const { request } = currentItem;
        this.servingQueries[request.id] = currentItem;

        this.cluster.send(request);
    }

    public get servingQueriesCount(): number {
        return Object.keys(this.servingQueries).length;
    }

    public pop(id: string): QueryQueueItem<T, F> {
        const item = this.servingQueries[id];
        delete this.servingQueries[id];
        return item;
    }

    public get(id: string): QueryQueueItem<T, F> {
        return this.servingQueries[id];
    }

    public get maxQueries(): number {
        return this._maxQueries;
    }
}
    
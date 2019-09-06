import * as path            from "path";
import { Subject }          from "rxjs";
import uuidv1               from "uuid/v1";

import { QueryQueue,
         QueryQueueItem,
         QueryObservable, 
         QueueRequest, 
         QueueResponse }   from "../queue";

import { Cluster }         from "./cluster";


export abstract class QueuedCluster<T, F extends Function> extends Cluster<T> {
    private queues: { [name: string]: QueryQueue<T, F> };
    private neededWorkers: number;
    private message$: Subject<QueryQueueItem<T, F>>;

    constructor(childProcessRelPath: string) {
        super(path.join(__dirname, childProcessRelPath));

        this.queues = {};
        this.createQueues();

        this.neededWorkers =
            Object.keys(this.queues)
                .reduce((acc, curr) => acc + this.queues[curr].maxQueries, 0);

        this.message$ = new Subject<QueryQueueItem<T, F>>();
        this.handleMessages(this.message$);
    }

    public start() {
        super.start(this.neededWorkers)
    }

    protected createQueue(name: string, maxQueries = 1) {
        this.queues[name] = new QueryQueue(this, maxQueries);
    }

    public queueMessage(request: QueueRequest<T>, cb: F, queueName = "default") {
        if(!request.id) {
            request.id = uuidv1();
        }
        request.queue = queueName;
        const queueItem: QueryQueueItem<T, F> = { request, cb };
        const queue = this.queues[queueName];

        queue.queueMessage(queueItem);
    }

    protected onResponse(response: QueueResponse<T>, sendHandle: any) {
        const queue = this.queues[response.queue];
        if(!queue) {
            console.log("Not a queue", response);
            return;
        }

        let queueItem: QueryQueueItem<T, F>;

        if (response.finished === true) {
            queueItem = queue.pop(response.id);
        } else {
            queueItem = queue.get(response.id);
        }

        queueItem.response = response;
        this.message$.next(queueItem);

        queue.nextQueueItem();
    }

    protected abstract handleMessages(message$: QueryObservable<T, F>);
    protected createQueues(): void {}
}

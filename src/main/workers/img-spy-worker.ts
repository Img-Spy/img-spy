import * as path            from "path";
import { fork,
         ChildProcess }     from "child_process";
import { Subject,
         Observable }       from "rxjs";


interface Identificable {
    id: string;
    type: string;

    worker?: number;
    keepAlive?: boolean;
    queue?: string;
}


export type QueryObservable<T extends Identificable> =
    Observable<QueryQueueItem<T>>;

interface QueryQueueItem<T extends Identificable> {
    message: T;
    response?: T;
    cb: Function;
}

class QueryQueue<T extends Identificable> {
    private queryQueue: QueryQueueItem<T>[];
    private servingQueries: { [id: string]: QueryQueueItem<T> };

    constructor(private cluster: WorkerCluster<T>, private _maxQueries) {
        this.queryQueue = [];
        this.servingQueries = {};
    }

    public queueMessage(queueItem: QueryQueueItem<T>) {
        this.queryQueue.push(queueItem);
        this.nextQueueItem();
    }

    public nextQueueItem() {
        if (this.servingQueriesCount >= this._maxQueries) { return; }

        const currentItem = this.queryQueue.shift();
        if (!currentItem) { return; }

        const { message } = currentItem;
        this.servingQueries[message.id] = currentItem;

        this.cluster.send(message);
    }

    public get servingQueriesCount(): number {
        return Object.keys(this.servingQueries).length;
    }

    public pop(id: string): QueryQueueItem<T> {
        const item = this.servingQueries[id];
        delete this.servingQueries[id];
        return item;
    }

    public get(id: string): QueryQueueItem<T> {
        return this.servingQueries[id];
    }

    public get maxQueries(): number {
        return this._maxQueries;
    }
}

type ProcessResponse<T extends Identificable> = (m: T, handler: any) => void;

class Worker<T extends Identificable> {
    protected childProcess: ChildProcess;
    private bussy: boolean;

    constructor(private id: number,
                childProcessFile: string,
                onResponse: ProcessResponse<T>) {

        console.log(`Starting worker with id ${id}`);
        this.childProcess = fork(childProcessFile);
        this.childProcess.on("message", (message: T, sendHandle: any) => {
            if (message.keepAlive !== true) {
                console.log(`Worker ${this.id} is now free.`);
                this.bussy = false;
            }
            onResponse(message, sendHandle);
        });
    }

    public send(message: T)  {
        if (this.bussy) {
            throw new Error("This worker is bussy");
        }

        this.bussy = true;
        console.log(`Send message ${message.type}-${message.id} to worker ${this.id}.`);
        message.worker = this.id;
        this.childProcess.send(message);
    }

    public get isBussy(): boolean {
        return this.bussy;
    }
}

export class WorkerCluster<T extends Identificable> {
    protected workers: Worker<T>[];

    constructor(private childProcessFile: string,
                private onResponse: ProcessResponse<T>) {
        this.workers = [];
    }

    public start(neededWorkers) {
        for (let i = 0; i < neededWorkers; i++) {
            const worker = new Worker(
                i,
                this.childProcessFile,
                this.onResponse
            );

            this.workers.push(worker);
        }
    }

    public send(message: T) {
        let freeWorker: Worker<T>;
        this.workers
            .some((worker) => {
            if (!worker.isBussy) {
                freeWorker = worker;
                return true;
            }
            return false;
        });

        if (!freeWorker) {
            throw new Error("No free workers");
        }

        freeWorker.send(message);
    }
}

export abstract class ImgSpyWorker<T extends Identificable> {
    private queues: { [name: string]: QueryQueue<T> };
    private cluster: WorkerCluster<T>;
    private neededWorkers: number;
    private message$: Subject<QueryQueueItem<T>>;

    constructor() {
        this.queues = {};
        this.onResponse = this.onResponse.bind(this);

        const childProcessFile = path.join(__dirname, this.childProcessFile);
        this.cluster = new WorkerCluster(
            childProcessFile,
            this.onResponse
        );

        this.createQueues();

        this.neededWorkers =
            Object.keys(this.queues)
                .reduce((acc, curr) => acc + this.queues[curr].maxQueries, 0);

        this.message$ = new Subject<QueryQueueItem<T>>();
        this.handleMessages(this.message$);
    }

    public start() {
        this.cluster.start(this.neededWorkers);
    }

    protected createQueue(name: string, maxQueries = 1) {
        this.queues[name] = new QueryQueue(this.cluster, maxQueries);
    }

    protected queueMessage(message: T, cb: Function, queueName = "default") {
        message.queue = queueName;
        const queueItem = { message, cb };
        const queue = this.queues[queueName];

        queue.queueMessage(queueItem);
    }

    private onResponse(response: T, sendHandle: any) {
        const queue = this.queues[response.queue];
        let queueItem: QueryQueueItem<T>;

        if (response.keepAlive === true) {
            queueItem = queue.get(response.id);
        } else {
            queueItem = queue.pop(response.id);
        }

        queueItem.response = response;
        this.message$.next(queueItem);

        queue.nextQueueItem();
    }

    protected abstract get childProcessFile(): string;
    protected abstract handleMessages(message$: QueryObservable<T>);
    protected createQueues(): void {}
}

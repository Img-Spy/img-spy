import * as path            from "path";
import { fork,
         ChildProcess }     from "child_process";


interface QueryQueueItem<T> {
    message: T;
    cb: Function;
}

export abstract class ImgSpyWorker<T> {
    protected childProcess: ChildProcess;
    private queryQueue: QueryQueueItem<T>[];
    private currentItem: QueryQueueItem<T>;

    constructor() {
        this.queryQueue = [];
    }

    public start() {
        const childProcessFile = path.join(__dirname, this.childProcessFile);
        this.childProcess = fork(childProcessFile);
        this.childProcess.on("message", (message: T, sendHandle: any) => {
            this.onMessageRetrieved(message, this.currentCallback, sendHandle);
            this.nextQueueItem();
        });
    }

    protected send(message: T) {
        this.childProcess.send(message);
    }

    protected queueMessage(message: T, cb: Function) {
        const queueItem = { message, cb };
        if (this.currentItem) {
            this.queryQueue.push(queueItem);
        } else {
            this.currentItem = queueItem;
            this.send(message);
        }
    }

    protected nextQueueItem() {
        this.currentItem = this.queryQueue.shift();

        if (this.currentItem) {
            const { message } = this.currentItem;
            this.send(message);
        }
    }

    protected get currentCallback(): Function {
        return this.currentItem.cb;
    }

    protected abstract get childProcessFile();
    protected abstract onMessageRetrieved(message: T, cb: Function, sendHandle: any);
}

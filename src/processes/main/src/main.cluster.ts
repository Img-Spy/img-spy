import { QueryObservable,
         QueueResponse,
         QueuedCluster }    from "img-spy-core";


type ResponseHandler<T> = (response: QueueResponse<T>) => void;

export class MainCluster<T>
        extends QueuedCluster<T, ResponseHandler<T>> {

    constructor() {
        super("./workers.js");
    }

    protected createQueues() {
        this.createQueue("default", 4);
    }

    protected handleMessages(message$: QueryObservable<T, ResponseHandler<T>>) {
        message$.subscribe(m => m.cb(m.response));
    }
}

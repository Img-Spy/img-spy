import { QueueRequest, QueueResponse, Notifiable } from "../queue";
import { Worker } from "../worker";
export declare abstract class Cluster<T> implements Notifiable<T> {
    private childProcessFile;
    protected workers: Worker<T>[];
    constructor(childProcessFile: string);
    start(neededWorkers: any): void;
    send(message: QueueRequest<T>): void;
    kill(): void;
    protected abstract onResponse(response: QueueResponse<T>, handler: any): any;
}

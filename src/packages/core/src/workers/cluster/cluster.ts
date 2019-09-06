import { QueueRequest,
         QueueResponse,
         Notifiable }       from "../queue";
import { Worker }           from "../worker";


export abstract class Cluster<T> implements Notifiable<T> {
    protected workers: Worker<T>[];

    constructor(private childProcessFile: string) {
        this.workers = [];
        this.onResponse = this.onResponse.bind(this);
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

    public send(message: QueueRequest<T>) {
        let freeWorker: Worker<T>;
        this.workers
            .some((worker) => {
            if (!worker.isBusy) {
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

    public kill() {
        this.workers.forEach((worker) => {
            worker.kill();
        });
    }

    protected abstract onResponse(response: QueueResponse<T>, handler: any);
}

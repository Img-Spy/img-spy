import { fork,
         ChildProcess }     from "child_process";

import { QueueRequest,
         QueueResponse }    from "../queue";

import { ProcessResponse }  from "./process-response";


export class Worker<T> {
    protected childProcess: ChildProcess;
    private busy: boolean;

    constructor(private id: number,
                childProcessFile: string,
                onResponse: ProcessResponse<T>) {

        console.log(`Starting worker with id ${id}`);
        this.childProcess = fork(childProcessFile);
        this.childProcess.on("message", (message: QueueResponse<T>, sendHandle: any) => {
            if (message.finished === true) {
                console.log(`Worker ${this.id} is now free.`);
                this.busy = false;
            }
            onResponse(message, sendHandle);
        });
    }

    public send(message: QueueRequest<T>)  {
        if (this.busy) {
            throw new Error("This worker is busy");
        }

        if(this.killed) {
            throw new Error("This worker is killed");
        }

        this.busy = true;
        console.log(`Send message ${message.type}-${message.id} to worker ${this.id}.`);
        message.worker = this.id;
        this.childProcess.send(message);
    }

    public kill() {
        this.childProcess.kill();
    }

    public get killed(): boolean {
        return this.childProcess.killed;
    }

    public get isBusy(): boolean {
        return this.busy;
    }
}

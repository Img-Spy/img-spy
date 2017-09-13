import * as path            from "path";
import { fork,
         ChildProcess }     from "child_process";


export abstract class ImgSpyWorker<T> {
    protected childProcess: ChildProcess;

    public start() {
        const childProcessFile = path.join(__dirname, this.childProcessFile);
        this.childProcess = fork(childProcessFile);
        this.childProcess.on("message", (message: T, sendHandle: any) => this.onMessageRetrieved(message, sendHandle));
    }

    protected send(message: T) {
        this.childProcess.send(message);
    }

    protected abstract get childProcessFile();
    protected abstract onMessageRetrieved(message: T, sendHandle: any);
}

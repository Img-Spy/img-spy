import { QueueResponse } from "../queue";


export class ChildProcessHelper<R> {
    
    constructor(
        protected _send: (message: QueueResponse<R>, sendHandle?: any) => void,
        protected id: string,    
        protected type: string,
        protected worker: number,
        protected queue: string,
    ) {}

    public send(response?: R) {
        const { id, type, worker, queue } = this;
        const code = 200;
        this._send({
            id, type, code, worker, queue, finished: false,
            response: response
        });
    }

    public finish() {
        const { id, type, worker, queue } = this;
        const code = 200;
        this._send({
            id, type, code, worker, queue, finished: true
        });
    }

    public error(code: number) {
        const { id, type, worker, queue } = this;
        this._send({
            id, type, code, worker, queue, finished: true
        });
    }
}

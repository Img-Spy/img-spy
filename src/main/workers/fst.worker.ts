import { ImgSpyWorker } from "./img-spy-worker";


interface HashQueueItem {
    path: string;
    cb: (hash: string) => void;
}

export type FstWorkerMessage = CalculateHashMessage | ReturnHashMessage;

export interface CalculateHashMessage {
    type: "calculateHash";
    content: {
        path: string;
    };
}

export interface ReturnHashMessage {
    type: "returnHash";
    content: {
        path: string;
        hash: string;
    };
}

export class FstWorker extends ImgSpyWorker<FstWorkerMessage> {
    private pendingHashes: Array<HashQueueItem>;
    private currentHash: HashQueueItem;

    constructor() {
        super();
        this.pendingHashes = [];
    }

    public get childProcessFile() {
        return "fst.childprocess.js";
    }

    public calculateHash(path: string, cb: (hash: string) => void) {
        const queueItem = { path, cb };
        if (this.currentHash) {
            this.pendingHashes.push(queueItem);
        } else {
            const message: CalculateHashMessage = {
                type: "calculateHash",
                content: { path }
            };

            this.currentHash = queueItem;
            this.send(message);
        }
    }

    protected onMessageRetrieved(message: FstWorkerMessage) {
        switch (message.type) {
            case "returnHash":
                this.onHashRetrieved(message);
                break;
        }
    }

    protected onHashRetrieved(message: ReturnHashMessage) {
        this.currentHash.cb(message.content.hash);
        this.currentHash = this.pendingHashes.shift();

        if (this.currentHash) {
            const path = this.currentHash.path;
            const message: CalculateHashMessage = {
                type: "calculateHash",
                content: { path }
            };

            this.send(message);
        }
    }
}

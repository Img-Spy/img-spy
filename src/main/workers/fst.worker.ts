import { AnalysisInfo }     from "main/models";
import { ImgFile }          from "tsk-js";

import { ImgSpyWorker }     from "./img-spy-worker";


export type FstWorkerMessage =
    AnalyzeImgMessage | AnalyzeImgCallbackMessage |
    ListImgMessage    | ListImgCallbackMessage;




export interface AnalyzeImgMessage {
    type: "analyzeImg";
    content: {
        path: string;
    };
}


export interface AnalyzeImgCallbackMessage {
    type: "analyzeImgCallback";
    content: AnalysisInfo;
}


export interface ListImgMessage {
    type: "listImg";
    content: {
        path: string;
        offset: number;
        inode: number;
    };
}


export interface ListImgCallbackMessage {
    type: "listImgCallback";
    content: Array<ImgFile>;
}


export class FstWorker extends ImgSpyWorker<FstWorkerMessage> {

    public get childProcessFile() {
        return "fst.childprocess.js";
    }

    public analyzeImage(path: string, cb: (hash: AnalysisInfo) => void) {
        const message: FstWorkerMessage = {
            type: "analyzeImg",
            content: { path }
        };
        this.queueMessage(message, cb);
    }

    public listImage(path: string, offset: number, inode: number,
                     cb: (hash: Array<ImgFile>) => void) {
        const message: FstWorkerMessage = {
            type: "listImg",
            content: { path, offset, inode }
        };
        this.queueMessage(message, cb);
    }

    protected onMessageRetrieved(message: FstWorkerMessage, cb: Function) {
        switch (message.type) {
            case "analyzeImgCallback":
                cb(message.content);
                break;

            case "listImgCallback":
                cb(message.content);
                break;
        }
    }
}

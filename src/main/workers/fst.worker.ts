import * as uuidv1          from "uuid/v1";
import { ImgFile }          from "tsk-js";

import { AnalysisInfo }     from "main/models";

import { ImgSpyWorker }     from "./img-spy-worker";



export type FstWorkerMessage =
    AnalyzeImgMessage       | AnalyzeImgCallbackMessage |
    ListImgMessage          | ListImgCallbackMessage |
    GetContentImgMessage    | GetContentImgCallbackMessage;



export interface AnalyzeImgMessage {
    id: string;
    type: "analyzeImg";
    content: {
        path: string;
    };
}


export interface AnalyzeImgCallbackMessage {
    id: string;
    type: "analyzeImgCallback";
    content: AnalysisInfo;
}


export interface ListImgMessage {
    id: string;
    type: "listImg";
    content: {
        path: string;
        offset: number;
        inode: number;
    };
}


export interface ListImgCallbackMessage {
    id: string;
    type: "listImgCallback";
    content: Array<ImgFile>;
}


export interface GetContentImgMessage {
    id: string;
    type: "getContentImg";
    content: {
        path: string;
        offset: number;
        inode: number;
    };
}


export interface GetContentImgCallbackMessage {
    id: string;
    type: "getContentImgCallback";
    content: Buffer;
}


export class FstWorker extends ImgSpyWorker<FstWorkerMessage> {

    public get childProcessFile() {
        return "fst.childprocess.js";
    }

    protected createQueues() {
        this.createQueue("default", 4);
    }

    public analyzeImage(path: string, cb: (hash: AnalysisInfo) => void) {
        const id = uuidv1();
        const message: FstWorkerMessage = {
            id,
            type: "analyzeImg",
            content: { path }
        };
        this.queueMessage(message, cb);
    }

    public listImage(path: string, offset: number, inode: number,
                     cb: (files: Array<ImgFile>) => void) {
        const id = uuidv1();
        const message: FstWorkerMessage = {
            id,
            type: "listImg",
            content: { path, offset, inode }
        };
        this.queueMessage(message, cb);
    }

    public getContentImage(path: string, offset: number, inode: number,
                     cb: (buffer: Buffer) => void) {
        const id = uuidv1();
        const message: FstWorkerMessage = {
            id,
            type: "getContentImg",
            content: { path, offset, inode }
        };
        this.queueMessage(message, cb);
    }

    protected onMessageRetrieved(message: FstWorkerMessage, cb: Function) {
        switch (message.type) {

            case "getContentImgCallback":
            case "analyzeImgCallback":
            case "listImgCallback":
                cb(message.content);
                break;
        }
    }
}

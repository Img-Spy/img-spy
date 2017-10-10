import * as uuidv1              from "uuid/v1";
import { ImgFile,
         TimelineItem }         from "tsk-js";
import { Observable }           from "rxjs";

import { AnalysisInfo,
         TimelineAnalysis,
         SearchResult }         from "main/models";

import { ImgSpyWorker,
         QueryObservable }      from "./img-spy-worker";



export type FstWorkerMessage =
    AnalyzeImgMessage       | AnalyzeImgCallbackMessage |
    ListImgMessage          | ListImgCallbackMessage |
    GetContentImgMessage    | GetContentImgCallbackMessage |
    TimelineImgMessage      | TimelineImgCallbackMessage |
    SearchImgMessage        | SearchImgCallbackMessage;



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


export interface TimelineImgMessage {
    id: string;
    type: "timelineImg";
    content: {
        path: string;
        offset: number;
        inode: number;
    };
}
export interface TimelineImgCallbackMessage {
    id: string;
    type: "timelineImgCallback";
    keepAlive: boolean;
    content: TimelineAnalysis;
}


export interface SearchImgMessage {
    id: string;
    type: "searchImg";
    content: {
        path: string;
        offset: number;
        inode: number;

        needle: string;
    };
}
export interface SearchImgCallbackMessage {
    id: string;
    type: "searchImgCallback";
    keepAlive: boolean;
    content: SearchResult | "complete";
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

    public timelineImage(path: string, offset: number, inode: number,
                         cb: (result: TimelineAnalysis) => void) {
        const id = uuidv1();
        const message: FstWorkerMessage = {
            id,
            type: "timelineImg",
            content: { path, offset, inode }
        };
        this.queueMessage(message, cb);
    }

    public searchImage(path: string, offset: number, inode: number,
                       needle: string, cb: (result: SearchResult) => void) {
        const id = uuidv1();
        const message: FstWorkerMessage = {
            id,
            type: "searchImg",
            content: { path, offset, inode, needle }
        };
        this.queueMessage(message, cb);
    }

    protected handleMessages(message$: QueryObservable<FstWorkerMessage>) {
        message$
            .filter(m => [
                "getContentImgCallback",
                "analyzeImgCallback",
                "listImgCallback",
            ].indexOf(m.response.type) > 0)
            .subscribe(m => {
                const { response, cb } = m;
                cb(response.content);
                cb(false);
            });

        message$
            .filter(m => m.response.type === "timelineImgCallback")
            .sampleTime(100)
            .subscribe(m => {
                const { response, cb } = m;
                const content = <TimelineAnalysis>response.content;

                cb(content);
                if (content.finish) {
                    cb("complete");
                    cb(false);
                }
            });

        message$
            .filter(m => m.response.type === "searchImgCallback")
            .subscribe(m => {
                const { cb } = m;
                const response = <SearchImgCallbackMessage>m.response;

                cb(response.content);
                if (!response.keepAlive) {
                    cb(false);
                }
            });
    }
}

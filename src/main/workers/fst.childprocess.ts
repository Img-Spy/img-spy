require("app-module-path").addPath(__dirname + "/../..");
require("rxjs/add/operator/sampleTime");

import * as md5File                 from "md5-file";
import * as uuidv1                  from "uuid/v1";
import { Observable,
         Observer }                 from "rxjs";
import { TSK,
         TimelineItem }             from "tsk-js";

import { TimelineAnalysis  }        from "main/models";

import { AnalyzeImgMessage,
         AnalyzeImgCallbackMessage,
         ListImgMessage,
         ListImgCallbackMessage,
         GetContentImgMessage,
         GetContentImgCallbackMessage,
         TimelineImgMessage,
         TimelineImgCallbackMessage,
         FstWorkerMessage }         from "./fst.worker";


const calculateHash =
    (message: AnalyzeImgMessage) => {
        const { path } = message.content,
                img = new TSK(path),
                info = img.analyze(),
                hash = md5File.sync(path),
                resp: AnalyzeImgCallbackMessage = {
                    ...message,
                    type: "analyzeImgCallback",
                    content: { path, hash, ...info }
                };

        process.send(resp);
    };

const listImage =
    (message: ListImgMessage) => {
        const { path, offset, inode } = message.content,
                img = new TSK(path),
                files = img.list(offset, inode),
                resp: ListImgCallbackMessage = {
                    ...message,
                    type: "listImgCallback",
                    content: files
                };

        process.send(resp);
    };

const getContentImage =
    (message: GetContentImgMessage) => {
        const { path, offset, inode } = message.content,
                img = new TSK(path),
                content = img.get(offset, inode),
                resp: GetContentImgCallbackMessage = {
                    ...message,
                    type: "getContentImgCallback",
                    content
                };

        process.send(resp);
    };

const timelineImage =
    (message: TimelineImgMessage) => {
        const { path, offset, inode } = message.content,
                img = new TSK(path);

        Observable
            .create((observer: Observer<TimelineAnalysis>) => {
                const files = img.timeline(offset, inode, (files) =>
                    observer.next({ files, finish: false })
                );

                observer.next({ files, finish: true });
                observer.complete();
            })
            .subscribe((result) => {
                const { files, finish } = result;
                const resp: TimelineImgCallbackMessage = {
                    ...message,
                    type: "timelineImgCallback",
                    keepAlive: !finish,
                    content: { files, finish }
                };
                process.send(resp);
            });
    };

process.on("message", (message: FstWorkerMessage, sendHandle: any) => {
    switch (message.type) {
        case "analyzeImg":
            calculateHash(message);
            break;

        case "listImg":
            listImage(message);
            break;

        case "getContentImg":
            getContentImage(message);
            break;

        case "timelineImg":
            timelineImage(message);
            break;
    }
});

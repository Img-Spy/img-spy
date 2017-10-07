require("app-module-path").addPath(__dirname + "/../..");
require("rxjs/add/operator/sampleTime");

import * as md5File                 from "md5-file";
import * as uuidv1                  from "uuid/v1";
import { Observable,
         Observer }                 from "rxjs";
import { TSK,
         TskOptions,
         TimelineItem }             from "tsk-js";

import { TimelineAnalysis,
         SearchResult }             from "main/models";

import { AnalyzeImgMessage,
         AnalyzeImgCallbackMessage,
         ListImgMessage,
         ListImgCallbackMessage,
         GetContentImgMessage,
         GetContentImgCallbackMessage,
         TimelineImgMessage,
         TimelineImgCallbackMessage,
         SearchImgMessage,
         SearchImgCallbackMessage,
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
        const { path, offset: imgaddr, inode } = message.content,
                img = new TSK(path),
                files = img.list({ imgaddr, inode }),
                resp: ListImgCallbackMessage = {
                    ...message,
                    type: "listImgCallback",
                    content: files
                };

        process.send(resp);
    };

const getContentImage =
    (message: GetContentImgMessage) => {
        const { path, offset: imgaddr, inode } = message.content,
                img = new TSK(path),
                content = img.get({ imgaddr, inode }),
                resp: GetContentImgCallbackMessage = {
                    ...message,
                    type: "getContentImgCallback",
                    content
                };

        process.send(resp);
    };

const timelineImage =
    (message: TimelineImgMessage) => {
        const { path, offset: imgaddr, inode } = message.content,
                img = new TSK(path),
                opts: TskOptions = { imgaddr, inode };

        Observable
            .create((observer: Observer<TimelineAnalysis>) => {
                const files = img.timeline(
                    (files) => observer.next({ files, finish: false }),
                    opts
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

const searchImage =
    (message: SearchImgMessage) => {
        const { path, offset: imgaddr, inode, needle } = message.content,
                img = new TSK(path),
                opts: TskOptions = { imgaddr, inode };

        Observable
            .create((observer: Observer<SearchResult>) => {
                const files = img.search(
                    needle,
                    (file, context, index) => observer.next({
                        file,
                        context,
                        index
                    }),
                    opts
                );

                observer.next(undefined);
                observer.complete();
            })
            .subscribe((result) => {
                const resp: SearchImgCallbackMessage = {
                    ...message,
                    type: "searchImgCallback",
                    keepAlive: !result,
                    content: result
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

        case "searchImg":
            searchImage(message);
            break;
    }
});

import { AnalyzeImgMessage,
         AnalyzeImgCallbackMessage,
         ListImgMessage,
         ListImgCallbackMessage,
         GetContentImgMessage,
         GetContentImgCallbackMessage,
         FstWorkerMessage }         from "./fst.worker";
import * as md5File                 from "md5-file";
import * as uuidv1                  from "uuid/v1";
import { TSK }                      from "tsk-js";


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
                content = img.getContent(offset, inode),
                resp: GetContentImgCallbackMessage = {
                    ...message,
                    type: "getContentImgCallback",
                    content
                };

        process.send(resp);
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
    }
});

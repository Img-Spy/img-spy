import { CalculateHashMessage,
         ReturnHashMessage,
         FstWorkerMessage }         from "./fst.worker";
import * as md5File                 from "md5-file";

const calculateHash =
    (message: CalculateHashMessage) => {
        const { path } = message.content,
                hash = md5File.sync(path),
                resp: ReturnHashMessage = {
                    type: "returnHash",
                    content: { path, hash }
                };

        process.send(resp);
    };

process.on("message", (message: FstWorkerMessage, sendHandle: any) => {
    switch (message.type) {
        case "calculateHash":
            calculateHash(message);
            break;
    }
});


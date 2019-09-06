import { FunctionMap }                  from "../../models";
import { WorkerInfo,
         buildMessageType }             from "../../ipc";

import { QueueRequest }                 from "../queue";

import { ChildProcessHandler }          from "./child-process-handler";
import { ChildProcessHelper }           from "./child-process-helper";


export type HandlerBuilder<T extends FunctionMap<T>> = {
    [K in keyof T]: (
        handler: (
            helper: ChildProcessHelper<ReturnType<T[K]>>,
            ...args: Parameters<T[K]>
        ) => void 
    ) => void;
}

export class ChildProcessHandlerFactory<T extends FunctionMap<T>> {
    constructor(private info: WorkerInfo<T>) {}

    handle(
        manageHandler: (handler: ChildProcessHandler) => void
    ): HandlerBuilder<T> {
        const info = this.info;
        return new Proxy<T>({} as T, {
            get<K extends keyof T>(target, method: K, receiver) {
                const messageType = buildMessageType(info, method);
                return (h: Function) => manageHandler({
                    messageType,
                    handle(
                        message: QueueRequest<Parameters<T[K]>>,
                        helper: ChildProcessHelper<ReturnType<T[K]>>
                    ): any {
                        return h.call({}, helper, ...message.request);
                    }
                } as ChildProcessHandler<Parameters<T[K]>, ReturnType<T[K]>>);
            }
        });
    }
}

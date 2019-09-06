import { FunctionMap } from "../../models";
import { WorkerInfo } from "../../ipc";
import { ChildProcessHandler } from "./child-process-handler";
import { ChildProcessHelper } from "./child-process-helper";
export declare type HandlerBuilder<T extends FunctionMap<T>> = {
    [K in keyof T]: (handler: (helper: ChildProcessHelper<ReturnType<T[K]>>, ...args: Parameters<T[K]>) => void) => void;
};
export declare class ChildProcessHandlerFactory<T extends FunctionMap<T>> {
    private info;
    constructor(info: WorkerInfo<T>);
    handle(manageHandler: (handler: ChildProcessHandler) => void): HandlerBuilder<T>;
}

import { HandlerBuilder } from "../../workers";
import { WorkerInfo } from "../../ipc";
import { FunctionMap } from "../../models";
import { PluginWorkers } from "../workers";
import { Builder } from "./builder";
export declare class PluginWorkersBuilder implements Builder<PluginWorkers> {
    private _handlers;
    constructor();
    createHandler<T extends FunctionMap<T>>(workerInfo: WorkerInfo<T>): HandlerBuilder<T>;
    build(): PluginWorkers;
}

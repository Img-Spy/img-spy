import { ChildProcessHandler,
         HandlerBuilder,
         ChildProcessHandlerFactory }   from "../../workers";
import { WorkerInfo }                   from "../../ipc";
import { FunctionMap }                  from "../../models";

import { PluginWorkers }                from "../workers";

import { Builder }                      from "./builder";
import { BuilderFunction } from "./builder-function";


export class PluginWorkersBuilder implements Builder<PluginWorkers> {
    private _handlers: ChildProcessHandler[];

    constructor(
    ) {
        this._handlers = [];
    }

    public createHandler<T extends FunctionMap<T>>(workerInfo: WorkerInfo<T>): HandlerBuilder<T> {
        return new ChildProcessHandlerFactory(workerInfo).handle(handler => {
            this._handlers.push(handler);
        });
    }

    public build(): PluginWorkers {
        return {
            handlers: this._handlers
        };
    }
}

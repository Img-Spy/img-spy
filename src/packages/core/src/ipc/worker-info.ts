import { FunctionMap } from "../models";


export class WorkerInfo<M extends FunctionMap<M>> {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}

import { WorkerInfo } from "./worker-info";
import { FunctionMap } from "../models";


const buildMessageType = <
    T extends FunctionMap<T>, 
    K extends keyof T
>(info: WorkerInfo<T>, name: K) => 
    `workers/${info.name}/${name}`;

export default buildMessageType;

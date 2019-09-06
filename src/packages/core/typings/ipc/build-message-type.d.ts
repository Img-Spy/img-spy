import { WorkerInfo } from "./worker-info";
import { FunctionMap } from "../models";
declare const buildMessageType: <T extends FunctionMap<T>, K extends keyof T>(info: WorkerInfo<T>, name: K) => string;
export default buildMessageType;

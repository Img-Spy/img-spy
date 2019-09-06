import { QueueRequest } from "../queue";
import { ChildProcessHelper } from "./child-process-helper";
export interface ChildProcessHandler<Req = any, Resp = any> {
    messageType: string;
    handle(request: QueueRequest<Req>, helper: ChildProcessHelper<Resp>): any;
}

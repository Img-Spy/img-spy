import { FstRoot, FstAddPayload, FstUnlinkPayload } from "./fst-watcher.models";
declare type Payload = FstAddPayload | FstUnlinkPayload;
declare const _default: import("img-spy-core").ReducerBuilder<FstRoot, Payload, any>;
export default _default;

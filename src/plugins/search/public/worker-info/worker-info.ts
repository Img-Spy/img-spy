import { WorkerInfo }       from "img-spy-core";

import BackgroundMethods    from "./methods";

const workerInfo = new WorkerInfo<BackgroundMethods>("SearchWorker");

export default workerInfo;

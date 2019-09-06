import * as path                    from "path";
import { filter,
         map, 
         switchMap}                 from "rxjs/operators";
import { ofType }                   from "redux-observable";

import { Sink,
         ActionEpic }               from "img-spy-core";
import { apiQuery }                 from "img-spy-api";

import { FstFile,
         fstWatcherTypes,
         fstWatcherActions, 
         fstWatcherSelectors }      from "img-spy-modules/fst-watcher";
         
import explorerWorkerInfo           from "@public/worker-info";
import State                        from "@public/state";


type Input = FstFile;
const getPhysicalContentEpic: ActionEpic<Input, State> = (
    action$, state$
) => {
    const sink = new Sink<FstFile>(
        (file) => `${file.address}-${file.path}`
    );

    return action$.pipe(
        ofType(fstWatcherTypes.CONTENT),
        filter(action => action.payload.address === "physical"),
        map(action => fstWatcherSelectors.getFstItem<Input>(
            state$.value.fstRoot,
            action.payload.path,
            action.payload.address)),

        sink.start(file => file),
        apiQuery((api, file) => api.worker(explorerWorkerInfo).get(
            path.resolve(state$.value.folder, file.path)
        )),
        switchMap(query$ => query$.pipe(
            sink.end(({input, response}) => input),
            map(ret => fstWatcherActions.add({
                    path: ret.input.path,
                    address: ret.input.address,
                    type: ret.input.type,

                    content: Buffer.from(ret.response, "base64")
                }, ret.input.address)
            )
        ))
    );
};

export default getPhysicalContentEpic;

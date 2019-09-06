import * as path                    from "path";
import { merge }                    from "rxjs";
import { filter,
         flatMap, 
         map, 
         switchMap}                 from "rxjs/operators";
import { ofType }                   from "redux-observable";

import { ActionEpic,
         EpicObservable,
         Sink }                     from "img-spy-core";
import { apiQuery }                 from "img-spy-api";
import { terminalActions }          from "img-spy-modules/terminal";
import { FstAddPayload,
         FstDataSource,
         fstWatcherOperations,
         fstWatcherTypes,
         fstWatcherActions }        from "img-spy-modules/fst-watcher";

import workerInfo                   from "@public/worker-info";
import State                        from "@public/state";


type Input = FstAddPayload | FstDataSource;
const analyzeDataSourceEpic: ActionEpic<Input, State> = (
    action$, state$
) => {
    const sink = new Sink<FstDataSource>(
        (dataSource) => `${dataSource.address}-${dataSource.path}`
    );

    return merge(
        /// Launch analyze calculation
        action$.pipe(
            fstWatcherOperations.filterDataSourceChange(state$),
            filter((dataSource) => !dataSource.computedHash),
            sink.start(dataSource => dataSource),
            flatMap(dataSource => [
                terminalActions.pushLine({ level: "notice",
                    text: `Analyzing image '${dataSource.path}'...`}),
                fstWatcherActions.analyze(dataSource)
            ])
        ),

        /// Analyze
        (action$ as EpicObservable<FstDataSource>).pipe(
            ofType(fstWatcherTypes.ANALYZE),
            apiQuery((api, action) => api.worker(workerInfo).analyze(
                path.resolve(state$.value.folder, action.payload.path)
            )),
            switchMap(query$ => query$.pipe(
                map(({input, response}) => (<FstDataSource>{
                    type: "dataSource",
                    path: input.payload.path,
                    computedHash: response.hash,
                    imgType: response.type,
                    partitions: response.partitions,
                })),
                sink.end(dataSource => dataSource),
                flatMap((dataSource) => [
                    fstWatcherActions.add(dataSource), // Update computedHash
                    terminalActions.pushLine({
                        level: "notice",
                        text: `md5(${dataSource.path}) = ${dataSource.computedHash}`
                    }),
                ])
            )),
        )
    );
};

export default analyzeDataSourceEpic;

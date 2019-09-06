import * as path                    from "path";
import { map,
         finalize,
         filter, 
         pluck,
         concatMap,
         switchMap}                   from "rxjs/operators";
import { ofType }                   from "redux-observable";

import { ActionEpic, Sink }         from "img-spy-core";
import { apiQuery }                 from "img-spy-api";

import { CrtTimelinePayload,
         TimelineItem,
         timelineActions,
         timelineTypes }            from "@public/modules/timeline";
import State                        from "@public/state";
import workerInfo                   from "@public/worker-info";
import { of, OperatorFunction, Observable, Observer } from "rxjs";


const timeline = (folder: string) => 
    apiQuery<CrtTimelinePayload, TimelineItem[]>((api, input) => 
        api.worker(workerInfo).timeline(
            path.resolve(folder, input.imgPath),
            input.offset,
            input.inode
        )
    );


const finalizeMap = <T>(
    mapFunc: (input: T) => T
): OperatorFunction<T, T> =>
    (source) => Observable.create((observer: Observer<T>) => {
        let lastValue: T = undefined;
        source.subscribe(
            (value) =>  {
                console.log("emit value");
                observer.next(value);
                lastValue = value;
            },
            null,
            () => {
                console.log("completed!");
                observer.next(mapFunc(lastValue));
                observer.complete();
            }
        );
    });

/*
 * Each time a timline is created, populate it.
 */
const populateTimelineEpic: ActionEpic<CrtTimelinePayload, State> = (
    action$, state$
) => {
    const sink = new Sink<{imgPath?: string, offset?: number, inode?: number}>(
        (crtArgs) => 
            `${crtArgs.imgPath}-${crtArgs.offset}-${crtArgs.inode}`
    );

    return action$.pipe(
        ofType(timelineTypes.CREATE),
        pluck("payload"),

        // Launch query to background workers
        sink.start(crtArgs => crtArgs),
        timeline(state$.value.folder),

        // Update timeline
        switchMap(query$ => query$.pipe(
            map(({input, response}) => {
                return timelineActions.updateTimeline({
                    path: input.path,
                    imgPath: input.imgPath,
                    inode: input.inode,
                    offset: input.offset,
                    complete: false,
                    rawItems: response,
                    sortedItems: response
                });
            }),
            finalizeMap(action => {
                console.log("JUST FINAL PLEASE!")
                sink.finalize(action.payload);
                const finalAction = timelineActions.updateTimeline({
                    path: action.payload.path,
                    complete: true,
                })
     
                return finalAction;
            })
        ))
        
        // finalize(() => {
        //     return timelineActions.updateTimeline({
        //         path: crtArgs.path,
        //         complete: true
        //     })
        // })
        
    )
    // map(m => {
    //     console.log("Api response", m.response)
    //     return { type: "BLEK" }; 
    // })
    // mergeMap((action) => {
    //     const { imgPath, offset, inode, path } = action.payload;

    //     return ApiObservable
    //         .create<TimelineAnalysis>((api, cb) =>
    //             api.timelineImage(imgPath, offset, inode, cb))
    //         .pipe(
    //             map((res) => {
    //                 console.log(res);
    //                 return actions.updateTimeline({
    //                     path,
    //                     complete: res.finish,
    //                     rawItems: res.files,
    //                     sortedItems: res.files
    //                 });
    //             })
    //         )
    // })
    // )
};

export default populateTimelineEpic;

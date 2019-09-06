import * as path                    from "path";
import { flatMap,
         map, 
         switchMap,
         concatMap}                      from "rxjs/operators";
import { ofType }                   from "redux-observable";

import { Sink,
         ActionEpic }               from "img-spy-core";
import { apiQuery }                 from "img-spy-api";

import { FstDirectory,
         fstWatcherTypes,
         fstWatcherSelectors,
         fstWatcherActions, 
         FstDataSource,
         FstFile}                   from "img-spy-modules/fst-watcher";

import workerInfo                   from "@public/worker-info";
import State                        from "@public/state";


type Input = FstDirectory | FstDataSource;


/**
 * Get path from the input. If it is a data source is the default disk path, but
 * if it is virtual use the image path.
 * @param item 
 */
const getPath = (state: State, item: Input) => path.resolve(
    state.folder,
    item.type === "dataSource" ? item.path : item.imgPath
);
    

// Epic to list files inside a virtual directory or data source
const virtualListEpic: ActionEpic<Input, State> = (
    action$, state$
) => {
    const sink = new Sink<Input>(
        (item) => `${item.address}-${item.path}`
    );

    return action$.pipe(
        ofType(fstWatcherTypes.LIST),
        map(action => fstWatcherSelectors.getFstItem<Input>(
            state$.value.fstRoot,
            action.payload.path,
            action.payload.address)),

        // Execute list operation on background
        // Prevent multiple list simultaneous operations for the same item
        sink.start(item => item), 
        apiQuery((api, item) => api.worker(workerInfo).list(
            getPath(state$.value, item), item.offset, item.inode)),

        // Prepare a fstWatcher action for each virtual item and update the 
        // flag loaded for the current one
        concatMap(query$ => query$.pipe(
            sink.end(ret => ret.input),
            concatMap(({input, response: files}) => {
                const actions = (files || []).map(file => {
                    const item: Partial<FstDirectory | FstFile> = {
                        path: `${input.path}/${file.name}`,
                        name: file.name,

                        address: "virtual",
                        imgPath: input.imgPath,
                        offset: input.offset,
                        inode: file.inode,
                        deleted: !file.allocated,
                    };

                    if(file.type === "directory") {
                        Object.assign(item, <FstDirectory>{
                            type: "directory",
                            children: {}
                        });
                    } else {
                        Object.assign(item, <FstFile>{
                            type: "file"
                        });
                    }

                    return fstWatcherActions.add(item, "virtual");
                });

                actions.push(fstWatcherActions.add({
                    path: input.path,
                    address: "virtual",
                    loaded: true
                }, "virtual"));

                return actions;
            })
        ))       
    )
};

export default virtualListEpic;

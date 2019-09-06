import { filter,
         map }                      from "rxjs/operators";

import { ActionEpic }               from "img-spy-core";
import { FstItem,
         FstAddPayload,
         FstDirectory,
         fstWatcherOperations,
         fstWatcherSelectors,
         fstWatcherActions }        from "img-spy-modules/fst-watcher";

import State                        from "./state";


type Input = FstAddPayload;
const virtualMountEpic: ActionEpic<Input, State> = (
    action$, state$
) => action$.pipe(
    fstWatcherOperations.filterDataSourceChange(state$),
    // TODO: Remove this any
    filter((dataSource: any) => {
        const state = state$.value;
        return !state.fstRoot.children.virtual.children[dataSource.path];
    }),
    map(fstDataSource => {
        const mountPoint = fstWatcherSelectors.getMountPoint(fstDataSource);
        let children: { [name: string]: FstItem };
        if (fstDataSource.imgType === "disk" ) {
            children = fstDataSource
                .partitions
                .map((partition): FstDirectory => ({
                    name: partition.description,
                    path: `${mountPoint}/${partition.description}`,
                    type: "directory",
                    address: "virtual",

                    imgPath: fstDataSource.path,
                    offset: partition.start,
                    inode: undefined,

                    isOpen: false,
                    canOpen: partition.hasFs,
                    children: {}
                }))
                .reduce((acc: any, child: FstItem) => {
                    acc[child.name] = child;
                    return acc;
                }, {});
        } else {
            children = {};
        }

        const virtualDsDirectory: FstDirectory = {
            path: mountPoint,
            imgPath: fstDataSource.path,
            name: mountPoint,
            address: "virtual",

            type: "directory",
            isOpen: false,
            children
        };

        return fstWatcherActions.add(virtualDsDirectory, "virtual");
    })
);

export default virtualMountEpic;

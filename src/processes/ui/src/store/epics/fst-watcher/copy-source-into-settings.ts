import { filter,
         map }                      from "rxjs/operators";

import { ActionEpic }               from "img-spy-core";
import { settingsActions }          from "img-spy-modules/settings";
import { FstAddPayload,
         fstWatcherOperations,
         fstWatcherSelectors }      from "img-spy-modules/fst-watcher";

import State                        from "./state";


type Input = FstAddPayload;

const copySourceIntoSettingsEpic: ActionEpic<Input, State> = (
    action$, state$
) => action$.pipe(
    fstWatcherOperations.filterDataSourceChange(state$),
    filter((fstDataSource: any) => { /* TODO: Check if the file is not deleted and remove any */
        const state = state$.value;
        return fstWatcherSelectors.hasFstItem(state.fstRoot, fstDataSource.path);
    }),
    map((fstDataSource) => settingsActions.updateSource({
        name: fstDataSource.name,
        path: fstDataSource.path,
        imgType: fstDataSource.imgType,

        hash: fstDataSource.hash,
        computedHash: fstDataSource.computedHash,
        partitions: fstDataSource.partitions
    }))
);

export default copySourceIntoSettingsEpic;

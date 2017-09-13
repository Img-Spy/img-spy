import { Observable }               from "rxjs";
import { Action }                   from "redux-actions";
import { actions as formActions }   from "react-redux-form";
import { combineEpics }             from "redux-observable";

import { actions }                  from "app/constants";
import { ApiObservable }            from "app/api";
import { EpicObservable,
         ActionObservable,
         ActionObserver,
         FstItem,
         FstUnlinkPayload,
         FstHashPayload,
         getFstType,
         getFstItem,
         hasFstItem,
         FstDataSource,
         DataSource,
         ImgSpyState }              from "app/models";
import { fstAdd,
         fstHash,
         deleteSource,
         updateSource,
         applySettings,
         pushTerminalLine }         from "app/actions";


const dataSourceChange$ =
    (action$: EpicObservable<FstItem>, store): Observable<FstDataSource> =>
        action$.ofType(actions.FST_ADD)
            .filter(action => action.payload.type === "dataSource")
            .map(action => {
                const state: ImgSpyState = store.getState();
                return getFstItem(state.fstRoot, action.payload.path) as FstDataSource;
            });


const launchCalcHashEpic = (action$: EpicObservable<FstItem>, store) =>
    dataSourceChange$(action$, store)
        .filter(dataSource => !dataSource.computedHash && !dataSource.computingHash)
        .flatMap(dataSource => [
            pushTerminalLine({ level: "notice", text: `Computing hash for '${dataSource.path}'...`}),
            fstHash(dataSource)
        ]);


const calcHashEpic = (action$: EpicObservable<FstDataSource>, store) =>
    action$.ofType(actions.FST_HASH)
        .mergeMap(action => {
            const { path } = action.payload;
            return ApiObservable
                .create<string>((api, cb) => api.calculateHash(path, cb))
                .map((computedHash) => ({
                    type: "dataSource",
                    path,
                    computedHash,
                    computingHash: false
                }) as FstDataSource);
        })
        .flatMap((fstDataSource) => {
            return [
                fstAdd(fstDataSource),
                pushTerminalLine({ level: "notice", text: `md5(${fstDataSource.path}) = ${fstDataSource.computedHash}`}),
            ];
        });


const copySourceIntoSettingsEpic = (action$: EpicObservable<FstItem>, store) =>
    dataSourceChange$(action$, store)
        .filter((fstDataSource) => { /* Check if the file is not deleted */
            const state: ImgSpyState = store.getState();
            return hasFstItem(state.fstRoot, fstDataSource.path);
        })
        .map((fstDataSource) => {
            const { computingHash, ...dataSource } = fstDataSource;
            return updateSource(dataSource);
        });


const removeFileEpic = (action$: EpicObservable<FstUnlinkPayload>, store) =>
    action$.ofType(actions.FST_UNLINK)
        .filter((action) => {
            const state: ImgSpyState = store.getState();
            const dataSource = state.settings.sources[action.payload.path];
            return !!dataSource;
        })
        .map((action) => deleteSource(action.payload.path));


export default () =>
    (combineEpics as any)(
        launchCalcHashEpic,
        removeFileEpic,
        calcHashEpic,
        copySourceIntoSettingsEpic
    );

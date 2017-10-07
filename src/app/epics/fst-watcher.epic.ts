import * as fs                      from "fs";
import { Observable,
         Observer }                 from "rxjs";
import { Action }                   from "redux-actions";
import { actions as formActions }   from "react-redux-form";
import { combineEpics }             from "redux-observable";
import { ImgFile }                  from "tsk-js";

import { AnalysisInfo }             from "main/models";

import { actions }                  from "app/constants";
import { EpicObservable,
         ActionObservable,
         ApiObservable,
         FstObservable,
         ActionObserver,
         FstItem,
         FstFile,
         FstAddPayload,
         FstUnlinkPayload,
         FstHashPayload,
         FstExportPayload,
         getFstType,
         getFstItem,
         getMountPoint,
         hasFstItem,
         FstDataSource,
         FstDirectory,
         DataSource,
         Sink,
         ImgSpyState }              from "app/models";
import { fstAdd,
         fstContent,
         fstAnalyze,
         fstExport,
         deleteSource,
         updateSource,
         applySettings,
         pushTerminalLine }         from "app/actions";


const dataSourceChange$ =
    (action$: EpicObservable<any>, store): Observable<FstDataSource> =>
        action$.ofType(actions.FST_ADD)
            .filter(action => {
                return action.payload.newItem.type === "dataSource";
            })
            .map(action => {
                const state: ImgSpyState = store.getState();
                return getFstItem(state.fstRoot, action.payload.newItem.path) as FstDataSource;
            });


const analyzeDataSourceEpic = (action$: EpicObservable<FstAddPayload | FstDataSource>, store) => {
    const sink = new Sink<FstDataSource>(
        (dataSource) => `${dataSource.address}-${dataSource.path}`
    );

    return Observable.merge(
        /// Launch analyze calculation
        dataSourceChange$(action$, store)
            .filter(dataSource => !dataSource.computedHash)
            .filter(sink.start)
            .flatMap(dataSource => [
                pushTerminalLine({ level: "notice", text: `Analyzing image '${dataSource.path}'...`}),
                fstAnalyze(dataSource)
            ]),

        /// Analyze
        (action$.ofType(actions.FST_ANALYZE) as EpicObservable<FstDataSource>)
            .mergeMap(action => {
                const { path } = action.payload;
                return ApiObservable
                    .create<AnalysisInfo>((api, cb) => api.analyzeImage(path, cb))
                    .filter(sink.end(action.payload))
                    .map((info) => ({
                        type: "dataSource",
                        path,
                        computedHash: info.hash,
                        imgType: info.type,
                        partitions: info.partitions,
                    }) as FstDataSource);
            })
            .flatMap((fstDataSource) => {
                return [
                    fstAdd(fstDataSource),
                    pushTerminalLine({
                        level: "notice",
                        text: `md5(${fstDataSource.path}) = ${fstDataSource.computedHash}`
                    }),
                ];
            }),
    );
};


const virtualMountEpic = (action$: EpicObservable<FstAddPayload>, store) =>
    dataSourceChange$(action$, store)
        .filter(dataSource => {
            const state: ImgSpyState = store.getState();
            return !state.fstRoot.children.virtual.children[dataSource.path];
        })
        .map(fstDataSource => {
            const mountPoint = getMountPoint(fstDataSource);
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

            return fstAdd(virtualDsDirectory, "virtual");
        });


const virtualListEpic = (action$: EpicObservable<FstDirectory>, store) => {
    const sink = new Sink<Action<FstDirectory>>(
        (action) => `${action.payload.address}-${action.payload.path}`
    );

    return action$.ofType(actions.FST_LIST)
        .filter(sink.start)
        .mergeMap(action => {
            const state: ImgSpyState = store.getState();
            const { path, imgPath, offset, inode, address } = action.payload;
            const item = getFstItem(state.fstRoot, path, address);

            return ApiObservable
                .create<ImgFile[]>((api, cb) => {
                    api.listImage(imgPath, offset, inode, cb);
                })
                .filter(sink.end(action))
                .map(files => ({ path, offset, imgPath, files }) );
        })
        .flatMap(acc => {
            const actions = [];

            if (acc.files) {
                acc.files.forEach(file => {
                    const item: any = {
                        path: `${acc.path}/${file.name}`,
                        name: file.name,

                        address: "virtual",
                        imgPath: acc.imgPath,
                        offset: acc.offset,
                        inode: file.inode,
                        deleted: !file.allocated,

                        type: file.type === "directory" ? "directory" : "file"
                    };

                    if (item.type === "directory") {
                        item.children = {};
                    }

                    actions.push(fstAdd(item, "virtual"));
                });
            }

            actions.push(fstAdd({
                path: acc.path,
                address: "virtual",
                loaded: true
            } as any, "virtual"));

            return actions;
        });
};

const copySourceIntoSettingsEpic = (action$: EpicObservable<FstAddPayload>, store) =>
    dataSourceChange$(action$, store)
        .filter((fstDataSource) => { /* Check if the file is not deleted */
            const state: ImgSpyState = store.getState();
            return hasFstItem(state.fstRoot, fstDataSource.path);
        })
        .map((fstDataSource) => updateSource({
                name: fstDataSource.name,
                path: fstDataSource.path,
                imgType: fstDataSource.imgType,

                hash: fstDataSource.hash,
                computedHash: fstDataSource.computedHash,
                partitions: fstDataSource.partitions
            })
        );


const exportFileEpic = (action$: EpicObservable<FstExportPayload>, store) =>
    action$.ofType(actions.FST_EXPORT)
        .mergeMap(action => {
            const state: ImgSpyState = store.getState();
            const { file: selector, path } = action.payload;
            const file = getFstItem(
                state.fstRoot,
                selector.path,
                selector.address
            ) as FstFile;
            let newAction$;

            if (!file.content) {
                newAction$ = Observable.from([
                    fstContent(file),
                    fstExport(selector, path)
                ]);
            } else {
                newAction$ = FstObservable
                    .writeFile(file, path)
                    .mapTo(
                        pushTerminalLine({
                            level: "notice",
                            text: `Exported file '${file.name}'`
                        })
                    );
            }

            return newAction$;
        });


const getContentEpic = (action$: EpicObservable<FstFile>, store) => {
    const fileSink = new Sink<Action<FstFile>>(
        (action) => `${action.payload.address}-${action.payload.path}`
    );

    return action$.ofType(actions.FST_CONTENT)
        .filter(fileSink.start)
        .mergeMap(action => {
            const state: ImgSpyState = store.getState();
            return FstObservable
                .getContent(state.folder, action.payload)
                .filter(fileSink.end(action));
        })
        .map((payload) => fstAdd({
                path: payload.file.path,
                address: payload.file.address,
                type: payload.file.type,

                content: payload.content
            }, payload.file.address)
        );
};

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
        analyzeDataSourceEpic,
        removeFileEpic,
        exportFileEpic,
        getContentEpic,
        virtualMountEpic,
        virtualListEpic,
        copySourceIntoSettingsEpic
    );

import * as fs                  from "fs";
import * as anymatch            from "anymatch";
import * as chokidar            from "chokidar";
import * as path                from "path";

import * as React               from "react";
import { bindActionCreators }   from "redux";
import { connect,
         MapStateToProps,
         MapDispatchToProps }   from "react-redux";

import { getRouter,
         RouteData,
         FstInfo,
         FstItem,
         getFstType,
         FstDirectory,
         FstFile,
         FstDataSource,
         ImgSpyState }          from "app/models";
import { fstAdd,
         fstUnlink }            from "app/actions";


interface InputWindowEventProps {}

interface FstWatcherActions {
    // fstAddDir: (path: string, info: FstInfo) => void;
    fstAdd: (item: FstItem) => void;
    fstUnlink: (path: string) => void;
}

interface FstWatcherProps {
    folder?: string;

    actions?: FstWatcherActions;
}

const mapStateToProps: MapStateToProps<FstWatcherProps, undefined> =
    (state: ImgSpyState, props) => {
        const mapProps: FstWatcherProps = {
            folder:  state.navigate.main.args.folder
        };
        return mapProps as any;
    };

const mapDispatchToProps: MapDispatchToProps<FstWatcherProps, undefined> =
    (dispatch, props) => {
        const actions: FstWatcherActions = {
            // fstAddDir: bindActionCreators(fstAddDir, dispatch),
            fstAdd:    bindActionCreators(fstAdd,    dispatch),
            fstUnlink: bindActionCreators(fstUnlink, dispatch)
        };

        return { actions } as any;
    };

export class FstWatcherClass extends React.Component<FstWatcherProps, undefined> {
    private watcher: chokidar.FSWatcher;

    public render() {
        const { folder, actions } = this.props;
        if (this.watcher) {
            console.warn("Render watcher!!");
            this.watcher.close();
        }

        this.watcher = chokidar
            .watch(folder, {
                ignored: (path: string) => {
                    return anymatch([`${folder}/.settings`, `${folder}/.mount`], path);
                },
                persistent: true,
                cwd: folder
            });

        this.watcher.on("addDir",    (dirPath: string, info) => {
            const   name = path.basename(dirPath ? dirPath : folder),
                    dir: FstDirectory = {
                        name,
                        path: `${dirPath}`,
                        address: "fisical",

                        type: "directory",
                        isOpen: !dirPath,
                    };

            actions.fstAdd(dir);
        });
        this.watcher.on("add",       (filePath: string, info) => {
            const   name = path.basename(filePath),
                    item = {
                        path: `${filePath}`,
                        name,
                        address: "fisical",

                        type: getFstType(filePath),
                    };

            actions.fstAdd(item as FstItem);
        });
        this.watcher.on("unlink",    (path: string)       => actions.fstUnlink(path));
        this.watcher.on("unlinkDir", (path: string)       => actions.fstUnlink(path));

        return null;
    }
}

export const FstWatcher =
    connect(mapStateToProps, mapDispatchToProps)(FstWatcherClass) as React.ComponentClass<InputWindowEventProps>;

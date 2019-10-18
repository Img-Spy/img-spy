import * as chokidar            from "chokidar";
import * as path                from "path";
import * as React               from "react";
import anymatch                 from "anymatch";

import { bindActionCreators }   from "redux";
import { connect }              from "react-redux";


import { CaseState }            from "store";
import { WindowArgs }           from "img-spy-core";
import { navigateSelectors }    from "img-spy-navigation";
import { FstItem,
         FstDirectory,
         fstWatcherActions,
         fstWatcherSelectors }  from "img-spy-modules/fst-watcher";


interface InputProps {}

interface StateProps {
    folder: string;
}

interface DispatchProps {
    actions: {
        // fstAddDir: (path: string, info: FstInfo) => void;
        fstAdd: (item: Partial<FstItem>) => void;
        fstUnlink: (path: string) => void;
    }
}

type FstWatcherProps = InputProps & StateProps & DispatchProps;

//////////

export class FstWatcherClass extends React.Component<FstWatcherProps> {
    private watcher: chokidar.FSWatcher;

    private fixPath(inputPath: string) {
        if(process.platform === "win32") {
            return inputPath.replace("\\", "/");
        }
        return inputPath;
    }

    private addDirectory(inputPath: string, info) {
        const { folder, actions } = this.props;
        const dirPath = this.fixPath(inputPath);
        const name = path.basename(dirPath ? dirPath : folder);
        const dir: FstDirectory = {
            name,
            path: `${dirPath}`,
            address: "physical",

            type: "directory",
            isOpen: !dirPath,
        };

        actions.fstAdd(dir);
    }

    private addFile(inputPath: string, info) {
        const { actions } = this.props;
        const filePath = this.fixPath(inputPath);
        const name = path.basename(filePath);
        const type = fstWatcherSelectors.getFstType(filePath); 
        const item: Partial<FstItem> = {
            path: `${filePath}`,
            name,
            address: "physical"
        };

        if(type === "dataSource") {
            item.type = "dataSource";
        } else if(type === "file") {
            item.type = type;
        }

        actions.fstAdd(item);
    }

    private changeFile(inputPath: string, info) {
        const { actions } = this.props;
        const filePath = this.fixPath(inputPath);
        const name = path.basename(filePath);
        const item:  Partial<FstItem> = {
            path: `${filePath}`,
            name,
            address: "physical",
            content: undefined
        };

        actions.fstAdd(item);
    } 

    public componentWillMount() {
        const { folder, actions } = this.props;
        if (this.watcher) {
            console.warn("Render watcher!!");
            this.watcher.close();
        }

        this.watcher = chokidar
            .watch(folder, {
                ignored: (inputPath: string) => {
                    const path = this.fixPath(inputPath);
                    return anymatch([`${folder}/.settings`, `${folder}/.mount`], path);
                },
                persistent: true,
                cwd: folder
            });

        this.watcher.on("addDir", 
            (itemPath, info) => this.addDirectory(itemPath, info));
        this.watcher.on("add", 
            (itemPath, info) => this.addFile(itemPath, info));
        this.watcher.on("change", 
            (itemPath, info) => this.changeFile(itemPath, info));

        this.watcher.on("unlink",    (path: string) => actions.fstUnlink(path));
        this.watcher.on("unlinkDir", (path: string) => actions.fstUnlink(path));
    }

    public render() {
        return null;
    }
}

//////////

export const FstWatcher =
    connect<StateProps, DispatchProps, InputProps, CaseState>(
        (state, props) => ({
            // TODO: Replace this with state.folder???
            folder: navigateSelectors.getArgs<WindowArgs>(state, "main").folder
        }),
        (dispatch, props) => ({ actions: {
            // fstAddDir: bindActionCreators(fstAddDir, dispatch),
            fstAdd:    bindActionCreators(fstWatcherActions.add,    dispatch),
            fstUnlink: bindActionCreators(fstWatcherActions.unlink, dispatch)
        }})
)(FstWatcherClass) as React.ComponentClass<InputProps>;

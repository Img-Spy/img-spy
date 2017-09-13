import * as path                from "path";
import * as fs                from "fs";
import { handleActions,
         Action }               from "redux-actions";

import { FstDirectory,
         FstItem,
         FstDataSource,
         FstHashPayload,
         DataSource,
         SettingsModel,
         FstUnlinkPayload }     from "app/models";
import { actions }              from "app/constants";


export default (folder, settings: SettingsModel) => {
    const initialState: FstDirectory = {
        name: path.basename(folder),
        type: "directory",
        path: "",
        isOpen: true,
        children: {}
    };
    Object.keys(settings.sources).forEach((path) => {
        const dataSource = settings.sources[path];
        insertDataSource(initialState, dataSource);
    });

    return handleActions<FstDirectory, FstItem>({
        [actions.FST_ADD]:
            (state: FstDirectory, action: Action<FstItem>): FstDirectory => {
                const newItem = action.payload;
                if (newItem.path === "") {
                    if (newItem.type === "directory") {
                        return {
                            ...state,
                            ...newItem,
                            children: {
                                ...state.children, ...newItem.children
                            }
                        };
                    } else {
                        throw Error("Wrong path for a file.");
                    }
                }

                console.log(`Add file into path: '${newItem.path}'`);
                return updatePath(state, newItem.path, (name, prev) => {
                    const nextItem: FstItem = { ...prev, ...newItem };
                    if ((nextItem.type === "directory") && !nextItem.children) {
                        nextItem.children = {};
                    }

                    return nextItem;
                });
            },

        [actions.FST_HASH]:
            (state: FstDirectory, action: Action<FstUnlinkPayload>): FstDirectory => {
                const { path } = action.payload;

                console.log(`Compute hash: '${path}'`);
                return updatePath(state, path,
                    (name, prev: FstDataSource) => ({...prev, computingHash: true })
                );
            },

        [actions.FST_UNLINK]:
            (state: FstDirectory, action: Action<FstUnlinkPayload>): FstDirectory => {
                const { path } = action.payload;

                console.log(`Delete path: '${path}'`);
                return deletePath(state, path);
            },

        [actions.FST_OPEN]:
            (state: FstDirectory, action: Action<FstUnlinkPayload>): FstDirectory => {
                const { path } = action.payload;

                if (path === "") {
                    return state;
                }

                console.log(`Open path: '${path}'`);
                return openPath(state, path);
            },

        [actions.FST_TOGGLE_OPEN]:
            (state: FstDirectory, action: Action<FstUnlinkPayload>): FstDirectory => {
                const { path } = action.payload;
                if (!path) {
                    return {
                        ...state,
                        isOpen: !state.isOpen
                    };
                }

                console.log(`Toggle path: '${path}'`);
                return updatePath(state, path,
                    (name, prev: FstDirectory | FstDataSource) =>
                        ({
                            ...prev,
                            isOpen: !prev.isOpen
                        })
                );
            }
    }, initialState);
};


///

type UpdatePathCallback = (name: string, prev: FstItem) => FstItem;
function updatePath(rootDir: FstDirectory, path: string, buildCurrItem: UpdatePathCallback): FstDirectory {
    const spath = path.split("/");
    return _updatePath();

    ///

    function _updatePath(currDir = rootDir, index = 0) {
        const currName = spath[index];
        if (spath.length - 1 === index) {
            return {
                ...currDir,
                children: {
                    ...currDir.children,
                    [currName]: buildCurrItem(currName, currDir.children[currName])
                }
            };
        }

        const nextDir = currDir.children[currName] as FstDirectory;
        if (!nextDir) {
            throw Error("Directory not found.");
        }

        return {
            ...currDir,
            children: {
                ...currDir.children,
                [currName]: _updatePath(nextDir, index + 1)
            }
        };
    }
}

function deletePath(rootDir: FstDirectory, path: string): FstDirectory {
    const spath = path.split("/");
    return _deletePath();

    ///

    function _deletePath(currDir = rootDir, index = 0): FstDirectory {
        const currName = spath[index];
        if (spath.length - 1 === index) {
            const { [currName]: rmChild, ...children  } = currDir.children;
            return { ...currDir, children };
        }

        const nextDir = currDir.children[currName] as FstDirectory;
        if (!nextDir) {
            return currDir;
        }

        return {
            ...currDir,
            children: {
                ...currDir.children,
                [currName]: _deletePath(nextDir, index + 1)
            }
        };
    }
}

function openPath(rootDir: FstDirectory, path: string): FstDirectory {
    const spath = path.split("/");
    return _openPath() as FstDirectory;

    ///

    function _openPath(currDir = rootDir, index = 0): FstDirectory {
        const currName = spath[index];
        if (spath.length - 1 === index) {
            return {
                ...currDir,
                isOpen: true
            };
        }

        const nextDir = currDir.children[currName] as FstDirectory;
        if (!nextDir) {
            throw Error("Directory not found.");
        }

        return {
            ...currDir,
            isOpen: true,
            children: {
                ...currDir.children,
                [currName]: _openPath(nextDir, index + 1)
            }
        };
    }
}

function insertDataSource(rootDir: FstDirectory, dataSource: DataSource): void {
    const spath = dataSource.path.split("/");
    let accPath = "";
    _insertDataSource();

    ////

    function _insertDataSource(currDir = rootDir, index = 0) {
        const currName = spath[index];
        accPath += (index > 0 ? "/" : "") + currName;
        if (spath.length - 1 === index) {
            const fstDataSource: FstDataSource = {
                ...dataSource,
                type: "dataSource"
            };
            delete fstDataSource.computingHash;
            currDir.children[currName] = fstDataSource;
            return;
        }

        let nextDir = currDir.children[currName] as FstDirectory;
        if (!nextDir) {
            nextDir = {
                type: "directory",
                name: currName,
                path: accPath,
                isOpen: false,

                children: {}
            };
            currDir.children[currName] = nextDir;
        }
        _insertDataSource(nextDir, index + 1);
    }
}

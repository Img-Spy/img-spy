import * as path                from "path";
import * as fs                  from "fs";
import { handleActions,
         Action }               from "redux-actions";

import { FstDirectory,
         FstItem,
         FstRoot,
         FstDataSource,
         FstAddPayload,
         FstHashPayload,
         DataSource,
         SettingsModel,
         FstUnlinkPayload }     from "app/models";
import { actions }              from "app/constants";


export default (folder, settings: SettingsModel) => {
    const initialFisical: FstDirectory = {
        name: path.basename(folder),
        type: "directory",
        path: "",
        address: "fisical",
        isOpen: true,
        children: {}
    };

    const initialState: FstRoot = {
        name: "root",
        type: "root",
        children: {
            fisical: initialFisical,
            virtual: {
                name: "Virtual",
                type: "directory",
                address: "virtual",
                isOpen: false,
                path: "",
                children: {}
            }
        }
    };
    Object.keys(settings.sources).forEach((path) => {
        const dataSource = settings.sources[path];
        insertDataSource(initialFisical, dataSource);
    });

    return handleActions<FstRoot, FstAddPayload | FstUnlinkPayload | FstHashPayload>({
        [actions.FST_ADD]:
            (state: FstRoot, action: Action<FstAddPayload>): FstRoot => {
                const { newItem } = action.payload;
                let { address } = action.payload;
                if (!address) {
                    address = "fisical";
                }

                const rootDir = state.children[address];
                if (newItem.path === "") {
                    if (newItem.type === "directory") {
                        return {
                            ...state,
                            children: {
                                ...state.children,
                                [address]: {
                                    ...rootDir,
                                    ...newItem
                                }

                            }
                        };
                    } else {
                        throw Error("Wrong path for a file.");
                    }
                }

                const newRootDir = updatePath(rootDir, newItem.path, (name, prev) => {
                    const nextItem: FstItem = { ...prev, ...newItem };
                    if ((nextItem.type === "directory") && !nextItem.children) {
                        nextItem.children = {};
                    }

                    return nextItem;
                });

                return {
                    ...state,
                    children: {
                        ...state.children,
                        [address]: newRootDir
                    }
                };
            },

        [actions.FST_HASH]:
            (state: FstRoot, action: Action<FstUnlinkPayload>): FstRoot => {
                const { path } = action.payload;
                let { address } = action.payload;
                if (!address) {
                    address = "fisical";
                }
                const rootDir = state.children[address];

                const newRootDir = updatePath(rootDir, path,
                    (name, prev: FstDataSource) => ({...prev, computingHash: true })
                );

                return {
                    ...state,
                    children: {
                        ...state.children,
                        [address]: newRootDir
                    }
                };
            },

        [actions.FST_UNLINK]:
            (state: FstRoot, action: Action<FstUnlinkPayload>): FstRoot => {
                const { path } = action.payload;
                let { address } = action.payload;
                if (!address) {
                    address = "fisical";
                }
                const rootDir = state.children[address];

                const newRootDir = deletePath(rootDir, path);

                return {
                    ...state,
                    children: {
                        ...state.children,
                        [address]: newRootDir
                    }
                };
            },

        [actions.FST_OPEN]:
            (state: FstRoot, action: Action<FstUnlinkPayload>): FstRoot => {
                const { path } = action.payload;
                let { address } = action.payload;
                if (!address) {
                    address = "fisical";
                }
                const rootDir = state.children[address];

                if (path === "") {
                    return state;
                }

                const newRootDir = openPath(rootDir, path);

                return {
                    ...state,
                    children: {
                        ...state.children,
                        [address]: newRootDir
                    }
                };
            },

        [actions.FST_TOGGLE_OPEN]:
            (state: FstRoot, action: Action<FstUnlinkPayload>): FstRoot => {
                const { path } = action.payload;
                let { address } = action.payload;
                if (!address) {
                    address = "fisical";
                }
                const rootDir = state.children[address];
                let newRootDir;
                if (!path) {
                    newRootDir = {
                        ...rootDir,
                        isOpen: !rootDir.isOpen
                    };
                } else {
                    newRootDir = updatePath(rootDir, path,
                        (name, prev: FstDirectory | FstDataSource) =>
                            ({
                                ...prev,
                                isOpen: !prev.isOpen
                            })
                    );
                }

                return {
                    ...state,
                    children: {
                        ...state.children,
                        [address]: newRootDir
                    }
                };
            }
    }, initialState);
};


///

type UpdatePathCallback = (name: string, prev: FstItem) => FstItem;
function updatePath(rootDir: FstDirectory, path: string, buildCurrItem: UpdatePathCallback): FstDirectory {
    const spath =  path.split("/");
    return _updatePath();

    ///

    function _updatePath(currDir = rootDir, index = 0) {
        const currName = spath[index];
        if (spath.length - 1 === index) {
            return {
                ...currDir,
                children: {
                    ...currDir.children,
                    [currName]: {
                        ...buildCurrItem(currName, currDir.children[currName]),
                        parentPath: currDir.path
                    }
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

                address: "fisical",
                parentPath: currDir.path,
                type: "dataSource"
            };
            delete fstDataSource.computingHash;
            currDir.children[currName] = fstDataSource;
            return;
        }

        let nextDir = currDir.children[currName] as FstDirectory;
        if (!nextDir) {
            nextDir = {
                name: currName,
                path: accPath,
                address: "fisical",
                parentPath: currDir.path,

                type: "directory",
                isOpen: false,
                children: {}
            };
            currDir.children[currName] = nextDir;
        }
        _insertDataSource(nextDir, index + 1);
    }
}

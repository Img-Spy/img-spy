import { DataSource }           from "img-spy-core";

import { FstItem,
         FstDirectory,
         FstDataSource }        from "./fst-watcher.models";


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

function openPath(rootDir: FstDirectory, path: string, openPath = false): FstDirectory {
    const spath = path.split("/");
    return _openPath() as FstDirectory;

    ///

    function _openPath(currDir = rootDir, index = 0): FstDirectory {
        const currName = spath[index];
        if (spath.length - (openPath ? 0 : 1) === index) {
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

                address: "physical",
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
                address: "physical",
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


export default {
    updatePath,
    deletePath,
    openPath,
    insertDataSource
};

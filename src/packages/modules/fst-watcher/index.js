import { pipe } from 'rxjs';
import anymatch from 'anymatch';
import { filter, map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { basename } from 'path';
import { reducerBuilder } from 'img-spy-core';

function hasFstItem(fstRoot, path) {
    const rootDir = fstRoot.children.physical;
    if (path === "") {
        return true;
    }
    const spath = path.split("/");
    return _hasFstItem();
    ///
    function _hasFstItem(currDir = rootDir, index = 0) {
        const currName = spath[index];
        if (spath.length - 1 === index) {
            return !!currDir.children[currName];
        }
        const nextDir = currDir.children[currName];
        if (nextDir && nextDir.type === "directory") {
            return _hasFstItem(nextDir, index + 1);
        }
        return false;
    }
}
function getFstItem(fstRoot, path, address) {
    // Defaults
    if (!address) {
        address = "physical";
    }
    // Get root directory
    const rootDir = fstRoot.children[address];
    // Return root if no path provided
    if (path === "") {
        return rootDir;
    }
    // Call recursive get
    const spath = path.split("/");
    return _getPath();
    ///
    function _getPath(currDir = rootDir, index = 0) {
        const currName = spath[index];
        if (spath.length - 1 === index) {
            return currDir.children[currName];
        }
        const nextDir = currDir.children[currName];
        if (!nextDir || nextDir.type !== "directory") {
            throw Error("Directory not found.");
        }
        return _getPath(nextDir, index + 1);
    }
}
function getFstParent(fstRoot, item) {
    if (item.parentPath !== undefined) {
        // If it is virtual and it is the root element, return the physical path
        // to the disk image file
        if (item.address === 'virtual' && item.parentPath.split('/').length === 1) {
            return getFstItem(fstRoot, item.imgPath);
        }
        return getFstItem(fstRoot, item.parentPath, item.address);
    }
    else if (item.address === 'virtual') {
        return getFstItem(fstRoot, item.imgPath);
    }
    else {
        return undefined;
    }
}
function getFstChildren(fstRoot, fstItem) {
    switch (fstItem.type) {
        case "directory": return fstItem.children;
        case "dataSource":
            const mountPoint = getMountPoint(fstItem);
            const mountFolder = fstRoot.children.virtual.children[mountPoint];
            if (mountFolder) {
                return mountFolder.children;
            }
            else {
                return null;
            }
        default:
            return null;
    }
}
function getMountPoint(fstDataSource) {
    // Old version using node crypto
    const crypto = require("crypto");
    return crypto.createHash("md5").update(fstDataSource.path).digest("hex");
    // Using webcrypto
    // const encoder = new TextEncoder();
    // const data = encoder.encode(fstDataSource.path);
    // return self.crypto.subtle.digest("SHA-1", data).then((value) => {
    //     return  hexString(value);
    // });
    // function hexString(buffer) {
    //     const byteArray = new Uint8Array(buffer);
    //     const hexCodes = [...byteArray].map(value => {
    //       const hexCode = value.toString(16);
    //       const paddedHexCode = hexCode.padStart(2, '0');
    //       return paddedHexCode;
    //     });
    //     return hexCodes.join('');
    // }
}
function getFullPath(fstItem) {
    const { imgPath, path } = fstItem;
    if (imgPath) {
        return `${imgPath}/${path.split("/").slice(1).join("/")}`;
    }
    return `${path.split("/").slice(1).join("/")}`;
}
function getFstType(path) {
    if (anymatch("**/*.dd", path)) {
        return "dataSource";
    }
    return "file";
}
function isFstSelected(item, selector) {
    return selector &&
        item.path === selector.path &&
        item.address === selector.address;
}
function getSortedChildren(children) {
    if (!children) {
        return [];
    }
    const sortedKeys = Object
        .keys(children)
        .sort((nameA, nameB) => {
        const fstA = children[nameA], fstB = children[nameB];
        if (fstB.type === "directory" && fstA.type !== "directory") {
            return 1;
        }
        if (fstA.type === "directory" && fstB.type !== "directory") {
            return -1;
        }
        return nameA.toLowerCase() > nameB.toLowerCase() ? 1 : -1;
    });
    // if (this.props.root) {
    //     sortedKeys = sortedKeys.filter((key) => key !== ".mount");
    // }
    return sortedKeys;
}
var selectors = {
    hasFstItem,
    getFstItem,
    getMountPoint,
    getFstParent,
    getFstChildren,
    getFullPath,
    getFstType,
    isFstSelected,
    getSortedChildren
};

const ADD = "imgspy/fst-watcher/ADD";
const UPDATE = "imgspy/fst-watcher/UPDATE";
const UNLINK = "imgspy/fst-watcher/UNLINK";
const OPEN = "imgspy/fst-watcher/OPEN";
const OPEN_OUT = "imgspy/fst-watcher/OPEN_OUT";
const TOGGLE_OPEN = "imgspy/fst-watcher/TOGGLE_OPEN";
const ANALYZE = "imgspy/fst-watcher/HASH";
const LIST = "imgspy/fst-watcher/LIST";
const CONTENT = "imgspy/fst-watcher/CONTENT";
const EXPORT = "imgspy/fst-watcher/EXPORT";
var types = {
    ADD,
    UPDATE,
    UNLINK,
    OPEN,
    OPEN_OUT,
    TOGGLE_OPEN,
    ANALYZE,
    LIST,
    CONTENT,
    EXPORT
};

const add = (newItem, address) => ({
    type: types.ADD,
    payload: { newItem, address }
});
const unlink = (path, address) => ({
    type: types.UNLINK,
    payload: { path, address }
});
const open = (path, address) => ({
    type: types.OPEN,
    payload: { path, address }
});
const toggleOpen = (selector) => ({
    type: types.TOGGLE_OPEN,
    payload: {
        path: selector.path,
        address: selector.address
    }
});
const openOut = (payload) => ({
    type: types.OPEN_OUT,
    payload
});
const analyze = (payload) => ({
    type: types.ANALYZE,
    payload
});
const list = (payload) => ({
    type: types.LIST,
    payload
});
const content = (payload) => ({
    type: types.CONTENT,
    payload
});
const exportFile = (file, path) => ({
    type: types.EXPORT, payload: { file, path }
});
var fstWatcher_actions = {
    add,
    unlink,
    open,
    toggleOpen,
    openOut,
    analyze,
    list,
    content,
    exportFile
};

function updatePath(rootDir, path, buildCurrItem) {
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
                    [currName]: {
                        ...buildCurrItem(currName, currDir.children[currName]),
                        parentPath: currDir.path
                    }
                }
            };
        }
        const nextDir = currDir.children[currName];
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
function deletePath(rootDir, path) {
    const spath = path.split("/");
    return _deletePath();
    ///
    function _deletePath(currDir = rootDir, index = 0) {
        const currName = spath[index];
        if (spath.length - 1 === index) {
            const { [currName]: rmChild, ...children } = currDir.children;
            return { ...currDir, children };
        }
        const nextDir = currDir.children[currName];
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
function openPath(rootDir, path, openPath = false) {
    const spath = path.split("/");
    return _openPath();
    ///
    function _openPath(currDir = rootDir, index = 0) {
        const currName = spath[index];
        if (spath.length - (openPath ? 0 : 1) === index) {
            return {
                ...currDir,
                isOpen: true
            };
        }
        const nextDir = currDir.children[currName];
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
function insertDataSource(rootDir, dataSource) {
    const spath = dataSource.path.split("/");
    let accPath = "";
    _insertDataSource();
    ////
    function _insertDataSource(currDir = rootDir, index = 0) {
        const currName = spath[index];
        accPath += (index > 0 ? "/" : "") + currName;
        if (spath.length - 1 === index) {
            const fstDataSource = {
                ...dataSource,
                address: "physical",
                parentPath: currDir.path,
                type: "dataSource"
            };
            delete fstDataSource.computingHash;
            currDir.children[currName] = fstDataSource;
            return;
        }
        let nextDir = currDir.children[currName];
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
var utils = {
    updatePath,
    deletePath,
    openPath,
    insertDataSource
};

function filterDataSourceChange(state$) {
    return pipe(ofType(types.ADD), filter((action) => {
        return action.payload.newItem.type === "dataSource";
    }), map(action => {
        const state = state$.value;
        return selectors.getFstItem(state.fstRoot, action.payload.newItem.path);
    }));
}

var index = {
    filterDataSourceChange
};

const dataSourceTypes = {
    DISK: 1,
    PARTITION: 2
};
const dataSourceFileActions = {
    MOVE: 1
};

const add$1 = (state, action) => {
    const { newItem } = action.payload;
    const address = action.payload.address || "physical";
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
        }
        else {
            throw Error("Wrong path for a file.");
        }
    }
    const newRootDir = utils.updatePath(rootDir, newItem.path, (name, prev) => {
        const nextItem = Object.assign({}, prev, newItem);
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
};
const unlink$1 = (state, action) => {
    const { path } = action.payload;
    let { address } = action.payload;
    if (!address) {
        address = "physical";
    }
    const rootDir = state.children[address];
    const newRootDir = utils.deletePath(rootDir, path);
    return {
        ...state,
        children: {
            ...state.children,
            [address]: newRootDir
        }
    };
};
const open$1 = (state, action) => {
    const { path } = action.payload;
    let { address } = action.payload;
    if (!address) {
        address = "physical";
    }
    const rootDir = state.children[address];
    if (path === "") {
        return state;
    }
    const children = {
        ...state.children,
        [address]: utils.openPath(rootDir, path)
    };
    if (address === 'virtual') {
        const item = selectors.getFstItem(state, path, address);
        children['physical'] = utils.openPath(state.children['physical'], item.imgPath, true);
    }
    return {
        ...state,
        children: {
            ...children,
        }
    };
};
const toggleOpen$1 = (state, action) => {
    const { path } = action.payload;
    let { address } = action.payload;
    if (!address) {
        address = "physical";
    }
    const rootDir = state.children[address];
    let newRootDir;
    if (!path) {
        newRootDir = {
            ...rootDir,
            isOpen: !rootDir.isOpen
        };
    }
    else {
        newRootDir = utils.updatePath(rootDir, path, (name, prev) => ({
            ...prev,
            isOpen: !prev.isOpen
        }));
    }
    return {
        ...state,
        children: {
            ...state.children,
            [address]: newRootDir
        }
    };
};
var fstWatcher_reducers = reducerBuilder({
    [types.ADD]: add$1,
    [types.UNLINK]: unlink$1,
    [types.OPEN]: open$1,
    [types.TOGGLE_OPEN]: toggleOpen$1
}, (info) => {
    const initialPhysical = {
        name: basename(info.args["folder"]),
        type: "directory",
        path: "",
        address: "physical",
        isOpen: true,
        children: {}
    };
    const initialState = {
        name: "root",
        type: "root",
        children: {
            physical: initialPhysical,
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
    Object.keys(info.initialSettings.sources).forEach((path) => {
        const dataSource = info.initialSettings.sources[path];
        utils.insertDataSource(initialPhysical, dataSource);
    });
    return initialState;
});

// TODO: Make this module easier to understand
const name = "fstRoot";

export default fstWatcher_reducers;
export { dataSourceFileActions, dataSourceTypes, fstWatcher_actions as fstWatcherActions, index as fstWatcherOperations, selectors as fstWatcherSelectors, types as fstWatcherTypes, utils as fstWatcherUtils, name };
//# sourceMappingURL=index.js.map

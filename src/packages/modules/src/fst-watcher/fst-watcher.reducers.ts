import * as path                from "path";
import { Reducer }              from "redux-actions";
import { reducerBuilder }       from "img-spy-core";

import { FstDirectory,
         FstItem,
         FstRoot,
         FstDataSource,
         FstAddPayload,
         FstUnlinkPayload }     from "./fst-watcher.models";
import utils                    from "./fst-watcher.utils";
import types                    from "./fst-watcher.types";
import selectors                from "./fst-watcher.selectors";


const add: Reducer<FstRoot, FstAddPayload> = (
    state, action
) => {
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
        } else {
            throw Error("Wrong path for a file.");
        }
    }

    const newRootDir = utils.updatePath(rootDir, newItem.path, (name, prev) => {
        const nextItem: FstItem = Object.assign({}, prev, newItem);
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
}

const unlink: Reducer<FstRoot, FstUnlinkPayload> = (
    state, action
) => {
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

const open: Reducer<FstRoot, FstUnlinkPayload> = (
    state, action
) => {
    const { path } = action.payload;
    let { address } = action.payload;
    if (!address) {
        address = "physical";
    }
    const rootDir = state.children[address];

    if (path === "") {
        return state;
    }

    const children =  {
        ...state.children,
        [address]: utils.openPath(rootDir, path)
    };

    if(address === 'virtual') {
        const item = selectors.getFstItem(state, path, address);
        children['physical'] = utils.openPath(state.children['physical'],
            item.imgPath, true);
    }

    return {
        ...state,
        children: {
            ...children,
        }
    };
}

const toggleOpen: Reducer<FstRoot, FstUnlinkPayload> = (
    state, action
): FstRoot => {
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
    } else {
        newRootDir = utils.updatePath(rootDir, path,
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


type Payload = FstAddPayload | FstUnlinkPayload;
export default reducerBuilder<FstRoot, Payload>({
        [types.ADD]: add,
        [types.UNLINK]: unlink,
        [types.OPEN]: open,
        [types.TOGGLE_OPEN]: toggleOpen
    }, (info) => {
        const initialPhysical: FstDirectory = {
            name: path.basename(info.args["folder"]),
            type: "directory",
            path: "",
            address: "physical",
            isOpen: true,
            children: {}
        };

        const initialState: FstRoot = {
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
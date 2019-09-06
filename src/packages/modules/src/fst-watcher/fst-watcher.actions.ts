import { Action }               from "redux-actions";

import { FstItem,
         FstFile,
         FstDirectory,
         FstAddPayload,
         FstUnlinkPayload,
         FileSelector,
         FstExportPayload, 
         AddressTypes }         from "./fst-watcher.models";
import types                    from "./fst-watcher.types";


const add = (
    newItem: Partial<FstItem>, address?: AddressTypes
): Action<FstAddPayload> => ({
    type: types.ADD,
    payload: { newItem, address }
});

const unlink = (
    path: string, address?: AddressTypes
): Action<FstUnlinkPayload> => ({
    type: types.UNLINK,
    payload: { path, address }
});

const open = (
    path: string, address?: AddressTypes
): Action<FstUnlinkPayload> => ({
    type: types.OPEN,
    payload: { path, address }
});

const toggleOpen = (
    selector: FileSelector
): Action<FstUnlinkPayload> => ({
    type: types.TOGGLE_OPEN,
    payload: {
        path: selector.path,
        address: selector.address
    }
});

const openOut = (
    payload: FstItem
): Action<FstItem> => ({
    type: types.OPEN_OUT,
    payload
});

const analyze = (
    payload: FstItem
): Action<FstItem> => ({
    type: types.ANALYZE,
    payload
});

const list = (
    payload: FstDirectory
): Action<FstDirectory> => ({
    type: types.LIST,
    payload
});

const content = (
    payload: FstFile
): Action<FstFile> => ({
    type: types.CONTENT,
    payload
});

const exportFile = (
    file: FileSelector, path: string
): Action<FstExportPayload> => ({
    type: types.EXPORT, payload: { file, path }
});


export default {
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

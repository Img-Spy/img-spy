import { Action } from "redux-actions";
import { FstItem, FstFile, FstDirectory, FstAddPayload, FstUnlinkPayload, FileSelector, FstExportPayload, AddressTypes } from "./fst-watcher.models";
declare const _default: {
    add: (newItem: Partial<FstDirectory> | Partial<FstFile> | Partial<import("./fst-watcher.models").FstDataSource>, address?: AddressTypes) => Action<FstAddPayload>;
    unlink: (path: string, address?: AddressTypes) => Action<FstUnlinkPayload>;
    open: (path: string, address?: AddressTypes) => Action<FstUnlinkPayload>;
    toggleOpen: (selector: FileSelector) => Action<FstUnlinkPayload>;
    openOut: (payload: FstItem) => Action<FstItem>;
    analyze: (payload: FstItem) => Action<FstItem>;
    list: (payload: FstDirectory) => Action<FstDirectory>;
    content: (payload: FstFile) => Action<FstFile>;
    exportFile: (file: FileSelector, path: string) => Action<FstExportPayload>;
};
export default _default;

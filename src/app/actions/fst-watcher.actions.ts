import { Action }               from "redux-actions";

import { FstItem,
         FstFile,
         FileSelector,
         FstDirectory,
         FstAddPayload,
         FstUnlinkPayload,
         FstExportPayload,
         FstHashPayload }       from "app/models";
import { actions }              from "app/constants";


export const fstAdd =
    (newItem: FstItem, address?: string): Action<FstAddPayload> =>
        ({ type: actions.FST_ADD, payload: { newItem, address } });

export const fstUnlink = (path: string, address?: string): Action<FstUnlinkPayload> =>
    ({ type: actions.FST_UNLINK, payload: { path, address } });

export const fstToggleOpen = (selector: FileSelector): Action<FstUnlinkPayload> =>
    ({
        type: actions.FST_TOGGLE_OPEN,
        payload: {
            path: selector.path,
            address: selector.address
        }
    });

export const fstOpen = (path: string, address?: string): Action<FstUnlinkPayload> =>
    ({ type: actions.FST_OPEN, payload: { path, address } });

export const fstHash = (payload: FstItem): Action<FstItem> =>
    ({ type: actions.FST_HASH, payload });

export const fstList = (payload: FstDirectory): Action<FstDirectory> =>
    ({ type: actions.FST_LIST, payload });

export const fstContent = (payload: FstFile): Action<FstFile> =>
    ({ type: actions.FST_CONTENT, payload});

export const fstExport = (file: FileSelector, path: string): Action<FstExportPayload> =>
    ({ type: actions.FST_EXPORT, payload: { file, path }});

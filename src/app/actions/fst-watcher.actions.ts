import { Action }               from "redux-actions";

import { FstItem,
         FstUnlinkPayload,
         FstHashPayload }       from "app/models";
import { actions }              from "app/constants";


// export const fstAddDir = (path: string, info: FstInfo): Action<FstAddPayload> =>
//     ({ type: actions.FST_ADD_DIR, payload: { path, info } });

export const fstAdd = (payload: FstItem): Action<FstItem> =>
    ({ type: actions.FST_ADD, payload });

export const fstUnlink = (path: string): Action<FstUnlinkPayload> =>
    ({ type: actions.FST_UNLINK, payload: { path } });

export const fstToggleOpen = (path: string): Action<FstUnlinkPayload> =>
    ({ type: actions.FST_TOGGLE_OPEN, payload: { path } });

export const fstOpen = (path: string): Action<FstUnlinkPayload> =>
    ({ type: actions.FST_OPEN, payload: { path } });

export const fstHash = (payload: FstItem): Action<FstItem> =>
    ({ type: actions.FST_HASH, payload });

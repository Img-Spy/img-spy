import { Action }               from "redux-actions";

import { CrtSearchPayload,
         TableSettings,
         SearchInfo }           from "app/models";
import { actions }              from "app/constants";


export const createSearch =
    (payload: CrtSearchPayload): Action<CrtSearchPayload> =>
        ({ type: actions.CREATE_SEARCH, payload });

export const updateSearch =
    (payload: Partial<SearchInfo>): Action<Partial<SearchInfo>> =>
        ({ type: actions.UPDATE_SEARCH, payload });

export const selectSearch = (payload: string): Action<string> =>
        ({ type: actions.SELECT_SEARCH, payload });

export const deleteSearch = (payload: string): Action<string> =>
        ({ type: actions.DELETE_SEARCH, payload });

export const updateSearchTable =
    (payload: TableSettings): Action<TableSettings> =>
        ({ type: actions.TABLE_SEARCH, payload });

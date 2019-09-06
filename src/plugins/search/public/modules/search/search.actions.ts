import { Action }               from "redux-actions";

import { CrtSearchPayload,
         SearchInfo,
         TableSettings }        from "./search.models";
import types                    from "./search.types";


const createSearch = (
    payload: CrtSearchPayload
): Action<CrtSearchPayload> => ({
    type: types.CREATE,
    payload
});

const updateSearch = (
    payload: Partial<SearchInfo>
): Action<Partial<SearchInfo>> => ({
    type: types.UPDATE,
    payload
});

const selectSearch = (
    payload: string
): Action<string> => ({
    type: types.SELECT, payload
});

const deleteSearch = (
    payload: string
): Action<string> => ({
    type: types.DELETE,
    payload
});

const updateSearchTable = (
    payload: TableSettings
): Action<TableSettings> => ({
    type: types.UPDATE_TABLE,
    payload
});


export default {
    createSearch,
    updateSearch,
    selectSearch,
    deleteSearch,
    updateSearchTable
};

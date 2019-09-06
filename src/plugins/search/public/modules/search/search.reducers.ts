import produce                  from "immer";
import { Reducer }              from "redux-actions";

import { reducerBuilder }       from "img-spy-core";

import { SearchModel,
         SearchSettings,
         SearchInfo,
         TableSettings,
         CrtSearchPayload }     from "./search.models";
import types                    from "./search.types";


const createSearch: Reducer<SearchModel, CrtSearchPayload> = (
    state, action
) => produce(state, draft => {
    const { id, name, needle, date, imgPath, offset,
            path, inode } = action.payload;

    draft.searchResults[id] = {
        id, name, needle, date, imgPath, offset, inode, path,

        // Defaults
        tableSettings: {
            defaultSorted: [
                { id: "path", desc: true },
                { id: "index", desc: false }
            ]
        },
        complete: false,
        rawItems: []
    };
});


const updateSearch: Reducer<SearchModel, Partial<SearchInfo>> = (
    state, action
) => produce(state, draft => {
    const { id, ...update } = action.payload;
    Object.assign(draft.searchResults[id], update);
});


const deleteSearch: Reducer<SearchModel, string> = (
    state, action
) => produce(state, draft => {
    delete draft.searchResults[action.payload];
});


const selectSearch: Reducer<SearchModel, string> = (
    state, action
) => produce(state, draft => {
    draft.selected = action.payload;
});


const updateSearchTable: Reducer<SearchModel, Partial<TableSettings>> = (
    state, action
) => produce(state, draft => {
    Object.assign(draft.tableSettings, action.payload);
});


type Payload = CrtSearchPayload | Partial<SearchInfo> | 
               string | Partial<TableSettings>;
export default reducerBuilder<SearchModel, Payload, SearchSettings>({
    [types.CREATE]: createSearch,
    [types.DELETE]: deleteSearch,

    [types.SELECT]: selectSearch,
    [types.UPDATE]: updateSearch,
    [types.UPDATE_TABLE]: updateSearchTable
}, info => {
    const searchResults = info.initialSettings.plugins.search || {};
    const selected = info.initialSettings.plugins.search ?
        Object.keys(info.initialSettings.plugins.search)[0] :
        undefined;

    return { searchResults, selected, tableSettings: {} };
});

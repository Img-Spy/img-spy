import { handleActions,
         Action }               from "redux-actions";

import { SettingsModel,
         TableSettings,
         SearchModel,
         SearchInfo,
         CrtSearchPayload }     from "app/models";
import { actions }              from "app/constants";


const createSearchReducer = (
    state: SearchModel,
    action: Action<CrtSearchPayload>
): SearchModel => {
    const { id, name, needle, date, imgPath, offset,
            path, inode } = action.payload;
    const { searchResults } = state;

    return {
        ...state,
        searchResults: {
            ...searchResults,

            [id]: {
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
            }
        }
    };
};

const updateSearchReducer = (
    state: SearchModel,
    action: Action<Partial<SearchInfo>>
): SearchModel => {
    const { id, ...update } = action.payload;
    const { [id]: prev } = state.searchResults;
    const { searchResults } = state;

    return {
        ...state,
        searchResults: {
            ...searchResults,

            [id]: {
                ...prev,
                ...update
            }
        }
    };
};

const deleteSearchReducer = (
    state: SearchModel,
    action: Action<string>
): SearchModel => {
    const id = action.payload;
    const { [id]: deleted, ...searchResults } = state.searchResults;

    return {
        ...state,
        searchResults,
    };
};

const selectSearchReducer = (
    state: SearchModel,
    action: Action<string>
): SearchModel => {
    const { payload: selected } = action;

    return { ...state, selected };
};

const updateSearchTableReducer = (
    state: SearchModel,
    action: Action<Partial<TableSettings>>
): SearchModel => {
    const { payload: update } = action;
    const { tableSettings: prev } = state;

    return {
        ...state,
        tableSettings: {
            ...prev,
            ...update
        }
    };
};

export default (settings: SettingsModel) => {

    const initialState: SearchModel = {
        searchResults: settings.searchResults || {},
        selected: settings.searchResults ?
            Object.keys(settings.searchResults)[0] :
            undefined,
        tableSettings: {}
     };

    return handleActions<SearchModel, any>({
        [actions.CREATE_SEARCH]: createSearchReducer,
        [actions.UPDATE_SEARCH]: updateSearchReducer,
        [actions.DELETE_SEARCH]: deleteSearchReducer,
        [actions.SELECT_SEARCH]: selectSearchReducer,
        [actions.TABLE_SEARCH]:  updateSearchTableReducer

    }, initialState);
};

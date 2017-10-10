import { Observable,
         Observer }                 from "rxjs";
import { Store }                    from "redux";
import { Action }                   from "redux-actions";
import { actions as formActions }   from "react-redux-form";
import { combineEpics }             from "redux-observable";

import { SearchResult }             from "main/models";

import { actions }                  from "app/constants";
import { EpicObservable,
         ImgSpyState,
         ApiObservable,
         Sink,
         SearchInfo,
         SearchItem,
         CrtSearchPayload }         from "app/models";
import { updateSearch,
         selectSearch,
         updateSettings }           from "app/actions";


/*
 * Each time a search is created, populate it.
 */
const populateSearchEpic = (
    action$: EpicObservable<CrtSearchPayload>,
    store: Store<ImgSpyState>
) =>
action$
    .ofType(actions.CREATE_SEARCH)
    .mergeMap((action) => {
        const { imgPath, offset, inode, needle, id } = action.payload;
        const initialAcc: Partial<SearchInfo> = {
            id,
            complete: false,
            rawItems: []
        };

        return ApiObservable
            .create<SearchResult>((api, cb) =>
                api.searchImage(imgPath, offset, inode, needle, cb))
            .scan((acc, res) => {
                if (res === undefined) {
                    acc.complete = true;
                } else {
                    const { file, context: ctx, index } = res;
                    const { rawItems } = acc;
                    const context = new Buffer(ctx).toString();

                    rawItems.push({
                        ...file,
                        context,
                        index
                    });
                }

                return acc;
            }, initialAcc)
            .map((searchResult) => {
                return updateSearch(searchResult);
            });
    });


/*
 * One active element should be selected if posible
 */
const activateSearchEpic = (
    action$: EpicObservable<CrtSearchPayload | string>,
    store: Store<ImgSpyState>
) =>
Observable
    .merge(
        /* The a search has been created, select it */
        (action$ as EpicObservable<CrtSearchPayload>)
            .ofType(actions.CREATE_SEARCH)
            .map((action) => selectSearch(action.payload.id)),

        /* Active item is deleted, select another one if possible */
        (action$ as EpicObservable<string>)
            .ofType(actions.DELETE_SEARCH)
            .filter((action) => {
                const { searchView } = store.getState();
                return searchView.selected === action.payload &&
                        Object.keys(searchView.searchResults).length > 0;
            })
            .map(() => {
                const { searchResults } = store.getState().searchView;
                return selectSearch(Object.keys(searchResults)[0]);
            })
    );


/*
 * Update settings autosave the current searches
 */
const autosaveSearchEpic = (
    action$: EpicObservable<Partial<SearchInfo>>,
    store: Store<ImgSpyState>
) =>
Observable
    .merge(
        /* When it's finished */
        action$
            .ofType(actions.UPDATE_SEARCH)
            .filter(action => {
                const { id } = action.payload;
                const searchResult = store
                    .getState()
                    .searchView
                    .searchResults[id];

                return searchResult.complete;
            }),

        /* When it's deleted */
        action$
            .ofType(actions.DELETE_SEARCH)
    )
    .debounceTime(1000)
    .map(action => {
        const { settings, searchView } = store.getState();
        return updateSettings({
            ...settings,
            searchResults: searchView.searchResults
        });
    });


export default () =>
    (combineEpics as any)(
        populateSearchEpic,
        activateSearchEpic,
        autosaveSearchEpic
    );

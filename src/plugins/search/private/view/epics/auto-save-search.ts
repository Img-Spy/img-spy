import { merge }                    from "rxjs";
import { ofType }                   from "redux-observable";
import { map,
         filter,
         debounceTime }             from "rxjs/operators";

import { ActionEpic }               from "img-spy-core";

import { settingsActions }          from "img-spy-modules/settings";

import State                        from "@public/state";

import { SearchInfo,
         SearchSettings,
         searchTypes }              from "@public/modules/search";


/*
 * Update settings autosave the current searches
 */
const autoSaveSearchEpic: ActionEpic<Partial<SearchInfo>, State> = (
    action$, state$
) => merge(
    /* When it's finished */
    action$.pipe(
        ofType(searchTypes.UPDATE),
        filter(action => {
            const { id } = action.payload;
            const searchResult = state$
                .value
                .search
                .searchResults[id];

            return searchResult.complete;
        })
    ),

    /* When it's deleted */
    action$.pipe(
        ofType(searchTypes.DELETE)
    )
).pipe(
    debounceTime(1000),
    map(action => {
        const { settings, search } = state$.value;
        return settingsActions.updateSettings<SearchSettings>({
            ...settings,
            plugins: {
                search: search.searchResults
            }
        });
    })
);

export default autoSaveSearchEpic;

import { merge }                    from "rxjs";
import { ofType }                   from "redux-observable";
import { map,
         filter }                   from "rxjs/operators";

import { ActionEpic,
         EpicObservable }           from "img-spy-core";

import { CrtSearchPayload,
         SearchModuleState }        from "../search.models";
import actions                      from "../search.actions";
import types                        from "../search.types";


/*
 * One active element should be selected if possible
 */
const activateSearchEpic: ActionEpic<CrtSearchPayload | string, SearchModuleState> = (
    action$, state$
) => merge(
    /* The a search has been created, select it */
    (action$ as EpicObservable<CrtSearchPayload>).pipe(
        ofType(types.CREATE),
        map((action) => actions.selectSearch(action.payload.id))
    ),

    /* Active item is deleted, select another one if possible */
    (action$ as EpicObservable<string>).pipe(
        ofType(types.DELETE),
        filter((action) => {
            const { search } = state$.value;
            return search.selected === action.payload &&
                    Object.keys(search.searchResults).length > 0;
        }),
        map(() => {
            const { searchResults } = state$.value.search;
            return actions.selectSearch(Object.keys(searchResults)[0]);
        })
    )
);

export default activateSearchEpic;

import { actionTypes as fromActionTypes,
         ModelAction }              from "react-redux-form";
import { map,
         filter,
         debounceTime }             from "rxjs/operators";
import { ofType,
         Epic }                     from "redux-observable";

import { fstWatcherActions }        from "img-spy-modules/fst-watcher";

import State                        from "@public/state";


const saveFstItemFormChanges: Epic<ModelAction, any, State> = (
    action$, state$
) => action$.pipe(
    ofType(fromActionTypes.CHANGE),
    filter((action) => {
        return action.model.startsWith("fstItem.");
    }),
    debounceTime(500),
    map((action) => {
        const state = state$.value;
        return fstWatcherActions.add(state.fstItem);
    })
);

export default saveFstItemFormChanges;

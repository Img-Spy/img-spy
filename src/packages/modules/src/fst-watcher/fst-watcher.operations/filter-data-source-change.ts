import { pipe,
         OperatorFunction }         from "rxjs";
import { filter,
         map }                      from "rxjs/operators";
import { StateObservable,
         ofType }                   from "redux-observable";
import { Action }                   from "redux-actions";

import { FstDataSource,
         FstAddPayload,
         FstState }                 from "../fst-watcher.models";
import types                        from "../fst-watcher.types";
import selectors                    from "../fst-watcher.selectors";


function filterDataSourceChange<S extends FstState>(
    state$: StateObservable<S>
): OperatorFunction<Action<FstAddPayload>, FstDataSource> {
    return pipe(
        ofType(types.ADD),
        filter((action: Action<any>) => {
            return action.payload.newItem.type === "dataSource";
        }),
        map(action => {
            const state = state$.value;
            return selectors.getFstItem<FstDataSource>(
                state.fstRoot,
                action.payload.newItem.path
            );
        })
    );
}

export default filterDataSourceChange;

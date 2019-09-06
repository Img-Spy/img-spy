import { OperatorFunction } from "rxjs";
import { StateObservable } from "redux-observable";
import { Action } from "redux-actions";
import { FstDataSource, FstAddPayload, FstState } from "../fst-watcher.models";
declare function filterDataSourceChange<S extends FstState>(state$: StateObservable<S>): OperatorFunction<Action<FstAddPayload>, FstDataSource>;
export default filterDataSourceChange;

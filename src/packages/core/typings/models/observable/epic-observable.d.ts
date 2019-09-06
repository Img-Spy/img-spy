import { Observable } from "rxjs";
import { Action } from "redux-actions";
import { ActionsObservable } from "redux-observable";
export declare type EpicObservable<T> = ActionsObservable<Action<T>> & Observable<Action<T>>;

import { Observable } from "rxjs";
import { QueryQueueItem } from "./query-queue-item";
export declare type QueryObservable<T, F> = Observable<QueryQueueItem<T, F>>;

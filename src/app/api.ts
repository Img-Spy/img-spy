import { Observable,
         Observer }     from "rxjs";
import { remote }       from "electron";

import { ImgSpyApi }    from "main/models";


export const api: ImgSpyApi = remote.require("../main/main").default;
type ApiCallback<T> = (...args: T[]) => void;

export class ApiObservable {
    public static create<T>(fn: (api: ImgSpyApi, cb: ApiCallback<T>) => void): Observable<T> {
        return Observable.create((observer: Observer<T>) => {
            fn(api, onResponse);

            function onResponse(value: T) {
                observer.next(value);
                observer.complete();
            }
        });
    }
}

// @TODO: For debug porposes
(window as any).api = api;

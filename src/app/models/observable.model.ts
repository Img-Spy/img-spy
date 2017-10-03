import * as fs                  from "fs";
import { Observable,
         Observer }             from "rxjs";
import { ActionsObservable }    from "redux-observable";
import { Action }               from "redux-actions";
import { TSK }                  from "tsk-js";

import { api }                  from "app/api";
import { ImgSpyApi }            from "main/models";

import { FstFile }              from "./fst-watcher.model";


interface FstContObsPayload {
    file: FstFile;
    content: Buffer;
}

export class FstObservable {
    public static getContent(folder: string, file: FstFile):
            Observable<FstContObsPayload> {

        if (file.address === "virtual") {
            const { path, imgPath, offset, inode } = file;
            return Observable.create(
                (observer: Observer<FstContObsPayload>) => {
                    const img = new TSK(`${folder}/${imgPath}`);
                    const content = img.getContent(offset, inode);

                    observer.next({ file, content });
                    observer.complete();
                });
        } else {
            return Observable.create(
                (observer: Observer<FstContObsPayload>) => {
                    fs.readFile(`${folder}/${file.path}`, (err, content) => {
                        observer.next({ file, content });
                        observer.complete();
                    });
                });
        }
    }

    public static writeFile(file: FstFile, path: string):
            Observable<NodeJS.ErrnoException> {
        return Observable
            .create((observer: Observer<NodeJS.ErrnoException>) => {
                fs.writeFile(path, file.content, (err) => {
                    observer.next(err);
                    observer.complete();
                });
            });
    }
}


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

export type EpicObservable<T>   = ActionsObservable<Action<T>> & Observable<Action<T>>;
export type ActionObservable<T> = Observable<Action<T>>;
export type ActionObserver<T>   = Observer<Action<T>>;


import * as fs                          from "fs";
import * as elementResizeDetectorMaker  from "element-resize-detector";
import { Observable,
         Observer }                     from "rxjs";
import { ActionsObservable }            from "redux-observable";
import { Action }                       from "redux-actions";
import { TSK }                          from "tsk-js";

import { api }                          from "app/api";
import { ImgSpyApi }                    from "main/models";

import { FstFile }                      from "./fst-watcher.model";
import { ResizeSize }                   from "./resize.model";


interface FstContObsPayload {
    file: FstFile;
    content: Buffer;
}

export class FstObservable {
    public static getContent(folder: string, file: FstFile):
            Observable<FstContObsPayload> {

        if (file.address === "virtual") {
            const { path, imgPath, offset: imgaddr, inode } = file;
            return Observable.create(
                (observer: Observer<FstContObsPayload>) => {
                    const img = new TSK(`${folder}/${imgPath}`);
                    const content = img.get({ imgaddr, inode });

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

            function onResponse(value: T | false) {
                if (value === false) {
                    observer.complete();
                } else {
                    observer.next(value);
                }
            }
        });
    }
}

type ResizeStrategy = "scroll" | "object";
export class ResizeObservable extends Observable<ResizeSize> {
    private static strategies = {
        // <- For ultra performance.
        scroll: elementResizeDetectorMaker( { strategy: "scroll"  } ),
        object: elementResizeDetectorMaker(),
    };

    public static create(
        element: HTMLElement,
        strategy: ResizeStrategy = "scroll"
    ): ResizeObservable {

        const selectedStrategy = ResizeObservable.strategies[strategy];

        const resize$ = Observable.create((observer: Observer<ResizeSize>) => {
            selectedStrategy.listenTo(element, onResize);
            return unsubscribe;

            function onResize() {
                const { clientHeight: height,
                        clientWidth: width,
                        scrollHeight,
                        scrollWidth,
                        offsetLeft: widthStart,
                        offsetTop: heightStart } = element;

                observer.next({
                    height,
                    width,

                    scrollHeight,
                    scrollWidth,

                    heightStart,
                    widthStart
                });
            }

            function unsubscribe() {
                selectedStrategy.removeListener(element, onResize);
            }

        });

        return resize$;
    }
}

export type EpicObservable<T>   = ActionsObservable<Action<T>> & Observable<Action<T>>;
export type ActionObservable<T> = Observable<Action<T>>;
export type ActionObserver<T>   = Observer<Action<T>>;

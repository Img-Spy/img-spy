import { OperatorFunction,
         Observable,
         pipe,
         from, 
         of }                   from "rxjs";

import { WorkerInfo,
         FunctionMap, 
         SettingsModel }        from "img-spy-core";

import api                      from "./api";

type WorkerObservables<T extends FunctionMap<T>> = {
    [K in keyof T]: (...args: Parameters<T[K]>) => Observable<ReturnType<T[K]>>;
}

export class ApiTranslator {
    public setFolder(folder: string): Observable<void> {
        return of(
            api.setFolderSync(folder)
        );
    }

    public closeWindow(name: string): Observable<void> {
        return of(
            api.closeWindowSync(name)
        );
    }

    public saveSettings(settings: SettingsModel): Observable<void> {
        return of(
            api.saveSettingsSync(settings)
        );
    }

    public worker<M extends FunctionMap<M>, K extends keyof M>(
        info: WorkerInfo<M>
    ): WorkerObservables<M> {
        return new Proxy<M>({} as M, {
            get(target, p: K, receiver) {
                return (...args: Parameters<M[K]>) => {
                    return api.worker(info, p, ...args);
                }
            }
        });
    }
}

export default new ApiTranslator();
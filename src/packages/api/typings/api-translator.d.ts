import { Observable } from "rxjs";
import { WorkerInfo, FunctionMap, SettingsModel } from "img-spy-core";
declare type WorkerObservables<T extends FunctionMap<T>> = {
    [K in keyof T]: (...args: Parameters<T[K]>) => Observable<ReturnType<T[K]>>;
};
export declare class ApiTranslator {
    setFolder(folder: string): Observable<void>;
    closeWindow(name: string): Observable<void>;
    saveSettings(settings: SettingsModel): Observable<void>;
    worker<M extends FunctionMap<M>, K extends keyof M>(info: WorkerInfo<M>): WorkerObservables<M>;
}
declare const _default: ApiTranslator;
export default _default;

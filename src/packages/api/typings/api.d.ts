import { Observable } from "rxjs";
import { WorkerInfo, SettingsModel, FunctionMap } from "img-spy-core";
export declare class ImgSpyApi {
    saveSettingsSync(settings: SettingsModel): void;
    setFolderSync(folder: string): void;
    closeWindowSync(name: string): void;
    loadSettingsSync<T>(): SettingsModel<T>;
    worker<T extends FunctionMap<T>, K extends keyof T>(info: WorkerInfo<T>, workerName: K, ...args: Parameters<T[K]>): Observable<ReturnType<T[K]>>;
}
declare const _default: ImgSpyApi;
export default _default;

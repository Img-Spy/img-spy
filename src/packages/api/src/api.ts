import { Observable, 
         Observer }             from "rxjs";
import { ipcRenderer }          from "electron";
import uuidv1                   from "uuid/v1";

import { channels,
         WorkerInfo,
         buildMessageType,
         ApiRequest, 
         ApiResponse,
         SettingsModel,
         FunctionMap }          from "img-spy-core";


export class ImgSpyApi {

    public saveSettingsSync(settings: SettingsModel): void {
        return ipcRenderer.sendSync(channels.SAVE_SETTINGS, settings);
    }

    public setFolderSync(folder: string): void {
        console.log("Set folder", folder);
        return ipcRenderer.sendSync(channels.SET_FOLDER, folder);
    }


    public closeWindowSync(name: string): void {
        return ipcRenderer.sendSync(channels.CLOSE_WINDOW, name);
    }

    public loadSettingsSync<T>(): SettingsModel<T> {
        console.log("Send message");
        return ipcRenderer.sendSync(channels.LOAD_SETTINGS);

        // const settingsDir = this.settingsDirPath;
        // if (!fs.existsSync(settingsDir)) {
        //     fs.mkdirSync(settingsDir);
        // }

        // const path = this.settingsFilePath;
        // console.log(`LOAD SETTINGS FROM "${path.split(" ").join("\\ ")}"`);
        // if (!fs.existsSync(path)) {
        //     const def = this.getDefaultSettings();
        //     fs.writeFileSync(path, JSON.stringify(def, null, 4));
        //     return def;
        // }

        // const settings = JSON.parse(fs.readFileSync(this.settingsFilePath).toString());
        // // Check settings
        // Object.keys(settings.sources)
        //     .forEach((relPath) => {
        //         if (!fs.existsSync(`${this.windowManager.folder}/${relPath}`)) {
        //             delete settings.sources[relPath];
        //         }
        //     });

        // return settings;
    }

    public worker<T extends FunctionMap<T>, K extends keyof T>(
        info: WorkerInfo<T>, workerName: K, ...args: Parameters<T[K]>
    ): Observable<ReturnType<T[K]>> {
        const id = uuidv1();
        const type = buildMessageType(info, workerName);
        const request: ApiRequest = {
            id, type,
            request: args
        };
        ipcRenderer.send(channels.WORKER, request);

        return Observable.create((observer: Observer<ReturnType<T[K]>>) => {
            const responseHandler = (e: Event, resp: ApiResponse) => {
                if(resp.id !== id)  return;
                if(resp.finished) {
                    if(resp.code !== 200) {
                        observer.error(resp);
                    }
                    observer.complete();
                    ipcRenderer.removeListener(channels.WORKER_RESPONSE,
                        responseHandler);
                    return;
                }
                observer.next(resp.response);
            };

            ipcRenderer.on(channels.WORKER_RESPONSE, responseHandler);
        });
    }
}

// export const api: ImgSpyApi = remote.require("./main.js").default;
export default new ImgSpyApi();

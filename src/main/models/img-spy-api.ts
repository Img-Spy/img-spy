import { app,
         BrowserWindow,
         dialog,
         ipcRenderer,
         ipcMain }              from "electron";
import * as fs                  from "fs";
import * as path                from "path";
import { ImgFile }              from "tsk-js";

import { SettingsModel }        from "app/models";

import { CONFIG }               from "main/config";
import { ImgSpyWindowManager }  from "main/windows";
import { AnalysisInfo,
         TimelineAnalysis }     from "main/models";
import { FstWorker }            from "main/workers";

import { WindowEvents,
         ImgSpyEvents }         from "./img-spy-events";


export class ImgSpyApi {
    private windowManager: ImgSpyWindowManager;
    private windowEvents: WindowEvents;
    private fstWorker: FstWorker;

    constructor() {
        this.windowManager = new ImgSpyWindowManager(app);
        this.windowEvents = {};

        this.fstWorker = new FstWorker();
        this.fstWorker.start();
    }

    // Handle windows
    public setFolder(folder: string) {
        this.windowManager.setFolder(folder );
    }

    public closeWindow(name: string) {
        this.windowManager.closeWindow(name);
    }

    public openSettings() {
        const settings = this.windowManager.openSettings();
    }

    public analyzeImage(path: string, cb: (hash: AnalysisInfo) => void) {
        this.fstWorker.analyzeImage(`${this.windowManager.folder}/${path}`, cb);
    }

    public listImage(path: string, offset: number, inode: number, cb: (files: Array<ImgFile>) => void) {
        this.fstWorker.listImage(`${this.windowManager.folder}/${path}`, offset, inode, cb);
    }

    public getContentImage(path: string, offset: number, inode: number, cb: (buffer: Buffer) => void) {
        this.fstWorker.getContentImage(`${this.windowManager.folder}/${path}`, offset, inode, cb);
    }

    public timelineImage(path: string, offset: number, inode: number, cb: (result: TimelineAnalysis) => void) {
        this.fstWorker.timelineImage(`${this.windowManager.folder}/${path}`, offset, inode, cb);
    }

    // Handle settings
    public loadSettingsSync(): SettingsModel {

        const settingsDir = this.settingsDirPath;
        if (!fs.existsSync(settingsDir)) {
            fs.mkdirSync(settingsDir);
        }

        const path = this.settingsFilePath;
        console.log(`LOAD SETTINGS FROM "${path.split(" ").join("\\ ")}"`);
        if (!fs.existsSync(path)) {
            const def = this.getDefaultSettings();
            fs.writeFileSync(path, JSON.stringify(def, null, 4));
            return def;
        }

        const settings = JSON.parse(fs.readFileSync(this.settingsFilePath).toString());
        // Check settings
        Object.keys(settings.sources)
            .forEach((relPath) => {
                if (!fs.existsSync(`${this.windowManager.folder}/${relPath}`)) {
                    delete settings.sources[relPath];
                }
            });

        return settings;
    }

    private getDefaultSettings(): SettingsModel {
        return {
            global: {
                caseName: path.basename(CONFIG.currentFolder)
            },
            sources: {},
            timelines: {},
            theme: "light"
        };
    }

    public loadSettings(cb: (value: SettingsModel) => void): void {
        const path = this.settingsFilePath;
        const t = this;

        fs.exists(path, (exists) => exists ? readSettings() : writeSettings());

        ////

        function readSettings() {
            fs.readFile(path, null, (err, data) => {
                cb(JSON.parse(data.toString()));
            });
        }

        function writeSettings() {
            t.saveSettings(t.getDefaultSettings(), () => readSettings());
        }
    }

    public saveSettings(settings: SettingsModel, cb: () => void): void {
        fs.writeFile(this.settingsFilePath, JSON.stringify(settings, null, 4), () => cb());
    }

    public get settingsFilePath(): string {
        return `${this.settingsDirPath}/settings.json`;
    }

    public get settingsDirPath(): string {
        return `${this.windowManager.folder}/.settings`;
    }

    // Events
    // public trigger(event: "close-settings", args: SettingsModel): void;
    // public trigger(event: ImgSpyEvents, args: any): void {
    //     const eventsToTrigger = this.windowEvents[event];
    //     if (!eventsToTrigger) {
    //         return;
    //     }

    //     for (let i = 0; i < eventsToTrigger.length; i++) {
    //         const event = eventsToTrigger[i];
    //         if (!this.windowManager.isOpen(event.uuid)) {
    //             eventsToTrigger.splice(i, 1);
    //             i--;
    //             continue;
    //         }

    //         event.cb(args);
    //     }
    // }

    // public on(event: "close-settings", uuid: string, cb: (settings: SettingsModel) => void): void;
    // public on(event: ImgSpyEvents, uuid: string, cb: (...args: any[]) => void): void {
    //     if (!this.windowEvents[event]) {
    //         this.windowEvents[event] = [];
    //     }
    //     this.windowEvents[event].push({ uuid: uuid, cb: cb });
    // }
}
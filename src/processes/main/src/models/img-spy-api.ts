import { app,
         Event,
         ipcMain }              from "electron";
import * as fs                  from "fs";
import * as path                from "path";

import { channels,
         ApiRequest,
         SettingsModel,
         ApiResponse }          from "img-spy-core";

import { CONFIG }               from "config";

import { ImgSpyWindowManager }  from "../windows";
import { MainCluster }          from "../main.cluster";


export class ImgSpyApi {
    private windowManager: ImgSpyWindowManager;
    private mainCluster: MainCluster<any>;

    constructor() {
        this.windowManager = new ImgSpyWindowManager(app);

        this.mainCluster = new MainCluster();
        this.mainCluster.start();

        this.bindApi();
        this.windowManager.on("allWindowsClosed", () => {
            this.mainCluster.kill();
        });
    }

    // Handle windows
    public setFolder(folder: string) {
        this.windowManager.setFolder(folder);
    }

    public closeWindow(name: string) {
        this.windowManager.closeWindow(name);
    }

    public openSettings() {
        const settings = this.windowManager.openSettings();
    }

    // public analyzeImage(path: string, cb: (hash: AnalysisInfo) => void) {
    //     this.mainCluster.analyzeImage(`${this.windowManager.folder}/${path}`, cb);
    // }

    // public listImage(path: string, offset: number, inode: number, cb: (files: Array<ImgFile>) => void) {
    //     this.mainCluster.listImage(`${this.windowManager.folder}/${path}`, offset, inode, cb);
    // }

    // public getContentImage(path: string, offset: number, inode: number, cb: (buffer: Buffer) => void) {
    //     this.mainCluster.getContentImage(`${this.windowManager.folder}/${path}`, offset, inode, cb);
    // }

    // public timelineImage(path: string, offset: number, inode: number, cb: (result: TimelineAnalysis) => void) {
    //     this.mainCluster.timelineImage(`${this.windowManager.folder}/${path}`, offset, inode, cb);
    // }

    // public searchImage(path: string, offset: number, inode: number, needle: string, cb: (result: SearchResult | "complete") => void) {
    //     this.mainCluster.searchImage(`${this.windowManager.folder}/${path}`, offset, inode, needle, cb);
    // }

    // Handle settings
    public loadSettingsSync(e: Event) {
        if(this.windowManager.folder === undefined) {
            e.returnValue = {};
            return;
        }

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

        e.returnValue = settings;
    }

    private getDefaultSettings(): SettingsModel {
        return {
            global: {
                caseName: path.basename(CONFIG.currentFolder)
            },
            sources: {},
            plugins: {},
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

    public saveSettingsSync(e: Event, settings: SettingsModel): void {
        console.log("Save settings!");
        fs.writeFileSync(this.settingsFilePath, JSON.stringify(settings, null, 4));
        e.returnValue = 0;
    }

    public get settingsFilePath(): string {
        return `${this.settingsDirPath}/settings.json`;
    }

    public get settingsDirPath(): string {
        return `${this.windowManager.folder}/.settings`;
    }

    public workers(event: Event, request: ApiRequest) {
        this.mainCluster.queueMessage(
            request,
            (resp) => this.workerResponse(event, resp)
        );
    }

    public workerResponse(event: Event, response: ApiResponse) {
        event.sender.send(channels.WORKER_RESPONSE, response);
    }

    bindApi() {
        ipcMain.on(channels.LOAD_SETTINGS, 
            (e) => this.loadSettingsSync(e));
        ipcMain.on(channels.SAVE_SETTINGS,
            (e, settings) => this.saveSettingsSync(e, settings));

        ipcMain.on(channels.SET_FOLDER, 
            (e, folder) => this.setFolder(folder));

        ipcMain.on(channels.CLOSE_WINDOW, 
            (e, windowName) => this.closeWindow(windowName));

        ipcMain.on(channels.WORKER, 
            (e, query) => this.workers(e, query));
    }
}

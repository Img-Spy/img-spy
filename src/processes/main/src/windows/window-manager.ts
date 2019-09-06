import { EventEmitter }         from "events";

import { IContext }             from "../context";
import { ImgSpyWindow }         from "./img-spy-window";


export abstract class WindowManager extends EventEmitter {
    public ctx: IContext;
    public reload: boolean;

    constructor(protected app: Electron.App) {
        super();

        const openWindows = {};
        this.ctx = { openWindows };
        this.reload = false;

        app.on("ready", () => this.onReady());
        app.on("window-all-closed", () => this.onAllWindowClosed());
        app.on("activate", () => this.onActivate());

        app.on("before-quit", () => {
            Object.keys(openWindows).forEach((name) => {
                const win: Electron.BrowserWindow = openWindows[name];
                win.removeAllListeners();
                win.close();
            });
            console.log("before-quit");
        });
        app.on("will-quit", () => {
            console.log("will-quit");
        });
    }

    public abstract onReady();

    protected onAllWindowClosed() {
        if (this.reload) {
            this.reload = false;
            this.onReady();
            return;
        }

        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== "darwin") {
            console.log("Bye");
            this.emit("allWindowsClosed");
            this.app.quit();
        }
    }

    protected onActivate() {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (!this.hasWindowsOpen) {
            this.onReady();
        }
    }

    public get windowsOpenLength(): number {
        return Object.keys(this.ctx.openWindows).length;
    }

    public get hasWindowsOpen(): boolean {
        return !!this.windowsOpenLength;
    }

    public closeWindow(name: string) {
        this.ctx.openWindows[name].close();
    }

    public registerWindow(win: ImgSpyWindow) {
        if (this.ctx.openWindows[win.name]) {
            throw new Error(`The window ${win.name} is already open`);
        }

        // Register window
        this.ctx.openWindows[win.name] = win;

        // General window behavior
        win.on("ready-to-show", () => win.show());
        win.on("close",         () => this.unregisterWindow(win));
        win.openWindow();
    }

    private unregisterWindow(win: ImgSpyWindow) {
        // Recursive unregister windows
        const children: Array<ImgSpyWindow> = win.getChildWindows() as any;
        children.forEach((child) => this.unregisterWindow(child));

        delete this.ctx.openWindows[win.name];
    }

    public isOpen(windowName: string): boolean {
        return !!this.ctx.openWindows[windowName];
    }

    public getWindow(windowName: string): ImgSpyWindow {
        return this.ctx.openWindows[windowName];
    }

    public send(windowName: string, channel: string, ...args: any[]) {
        const window = this.ctx.openWindows[windowName];
        if (!window) {
            return;
        }

        console.log(`Send to window '${windowName}' using the '${channel}' channel`);
        window.webContents.send(channel, ...args);
    }
}
